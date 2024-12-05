import { ChainId } from 'config/chains'
import {
  Currency,
  CurrencyAmount,
  Pair,
  Price,
  Token,
  WNATIVE,
  WETH9,
  ERC20Token,
  TradeType,
} from 'libraries/swap-sdk'
import { useReadContract } from 'wagmi'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { GTOKEN, USDT} from 'libraries/tokens'
import { useMemo } from 'react'
import getLpAddress from 'utils/getLpAddress'
import { multiplyPriceByAmount } from 'utils/prices'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'
import { computeTradePriceBreakdown } from 'views/Swap/V3Swap/utils/exchange'
import { warningSeverity } from 'utils/exchange'
import { SmartRouterTrade } from 'libraries/smart-router/evm'
import { PairState, usePairs } from './usePairs'
import { useActiveChainId } from './useActiveChainId'
import { useBestAMMTrade } from './useBestAMMTrade'

type UseStablecoinPriceConfig = {
  enabled?: boolean
  hideIfPriceImpactTooHigh?: boolean
}
const DEFAULT_CONFIG: UseStablecoinPriceConfig = {
  enabled: true,
  hideIfPriceImpactTooHigh: false,
}

export function useStablecoinPrice(
  currency?: Currency,
  config: UseStablecoinPriceConfig = DEFAULT_CONFIG,
): Price<Currency, Currency> | undefined {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = currency?.chainId ?? ChainId.ETHEREUM
  const { enabled, hideIfPriceImpactTooHigh } = { ...DEFAULT_CONFIG, ...config }

  const stableCoin = chainId in ChainId ? USDT[chainId as ChainId] : undefined

  const isStableCoin = currency && stableCoin && currency.wrapped.equals(stableCoin)

  const shouldEnabled = currency && stableCoin && enabled && currentChainId === chainId && !isStableCoin

  const enableLlama = currency?.chainId === ChainId.ETHEREUM && shouldEnabled

  // we don't have too many AMM pools on ethereum yet, try to get it from api
  const { data: priceFromLlama, isLoading } = useQuery({
    queryKey: ['fiat-price-ethereum', currency],
    queryFn: async () => {
      const address = currency?.isToken ? currency.address : WETH9[ChainId.ETHEREUM]?.address
      return fetch(`https://coins.llama.fi/prices/current/ethereum:${address}`) // <3 llama
        .then((res) => res.json())
        .then(
          (res) => res?.coins?.[`ethereum:${address}`]?.confidence > 0.9 && res?.coins?.[`ethereum:${address}`]?.price,
        )
    },
    staleTime: SLOW_INTERVAL,
    refetchInterval: SLOW_INTERVAL,
    enabled: currency && enableLlama,
  })

  const amountOut = useMemo(
    () => (stableCoin ? CurrencyAmount.fromRawAmount(stableCoin, 5 * 10 ** stableCoin.decimals) : undefined),
    [stableCoin],
  )

  const { trade } = useBestAMMTrade({
    amount: amountOut,
    currency,
    baseCurrency: stableCoin,
    tradeType: TradeType.EXACT_OUTPUT,
    maxSplits: 0,
    enabled: enableLlama ? !isLoading && !priceFromLlama : shouldEnabled,
    autoRevalidate: false,
    type: 'api',
  })

  const price = useMemo(() => {
    if (!currency || !stableCoin || !enabled) {
      return undefined
    }

    // handle stable coin
    if (isStableCoin) {
      return new Price(stableCoin, stableCoin, '1', '1')
    }

    if (priceFromLlama && enableLlama) {
      return new Price(
        currency,
        stableCoin,
        1 * 10 ** currency.decimals,
        getFullDecimalMultiplier(stableCoin.decimals)
          .times(parseFloat(priceFromLlama).toFixed(stableCoin.decimals))
          .toString(),
      )
    }

    if (trade) {
      const { inputAmount, outputAmount } = trade

      // if price impact is too high, don't show price
      if (hideIfPriceImpactTooHigh) {
        const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade as unknown as SmartRouterTrade<TradeType>)

        if (!priceImpactWithoutFee || warningSeverity(priceImpactWithoutFee) > 2) {
          return undefined
        }
      }

      return new Price(currency, stableCoin, inputAmount?.quotient ?? 0n, outputAmount?.quotient ?? 0n)
    }

    return undefined
  }, [
    currency,
    stableCoin,
    enabled,
    isStableCoin,
    priceFromLlama,
    enableLlama,
    trade,
    hideIfPriceImpactTooHigh,
  ])

  return price
}

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId } = useActiveChainId()
  const wrapped = currency?.wrapped
  const wnative = WNATIVE[chainId]
  const stable = USDT[chainId]

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
      [stable && wrapped?.equals(stable) ? undefined : wrapped, stable],
      [chainId ? wnative : undefined, stable],
    ],
    [wnative, stable, chainId, currency, wrapped],
  )
  const [[bnbPairState, bnbPair], [busdPairState, busdPair], [busdBnbPairState, busdBnbPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId || !wnative) {
      return undefined
    }

    // handle busd
    if (wrapped.equals(stable)) {
      return new Price(stable, stable, '1', '1')
    }

    const isBUSDPairExist =
      busdPair &&
      busdPairState === PairState.EXISTS &&
      busdPair.reserve0.greaterThan('0') &&
      busdPair.reserve1.greaterThan('0')

    // handle wbnb/bnb
    if (wrapped.equals(wnative)) {
      if (isBUSDPairExist) {
        const price = busdPair.priceOf(wnative)
        return new Price(currency, stable, price.denominator, price.numerator)
      }
      return undefined
    }

    const isBnbPairExist =
      bnbPair &&
      bnbPairState === PairState.EXISTS &&
      bnbPair.reserve0.greaterThan('0') &&
      bnbPair.reserve1.greaterThan('0')
    const isBusdBnbPairExist =
      busdBnbPair &&
      busdBnbPairState === PairState.EXISTS &&
      busdBnbPair.reserve0.greaterThan('0') &&
      busdBnbPair.reserve1.greaterThan('0')

    const bnbPairBNBAmount = isBnbPairExist && bnbPair?.reserveOf(wnative)
    const bnbPairBNBBUSDValue =
      bnbPairBNBAmount && isBUSDPairExist && isBusdBnbPairExist
        ? busdBnbPair.priceOf(wnative).quote(bnbPairBNBAmount).quotient
        : 0n

    // all other tokens
    // first try the busd pair
    if (isBUSDPairExist && busdPair.reserveOf(stable).greaterThan(bnbPairBNBBUSDValue)) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, stable, price.denominator, price.numerator)
    }
    if (isBnbPairExist && isBusdBnbPairExist) {
      if (busdBnbPair.reserveOf(stable).greaterThan('0') && bnbPair.reserveOf(wnative).greaterThan('0')) {
        const bnbBusdPrice = busdBnbPair.priceOf(stable)
        const currencyBnbPrice = bnbPair.priceOf(wnative)
        const busdPrice = bnbBusdPrice.multiply(currencyBnbPrice).invert()
        return new Price(currency, stable, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    wnative,
    stable,
    bnbPair,
    busdBnbPair,
    busdPairState,
    busdPair,
    bnbPairState,
    busdBnbPairState,
  ])
}

export const usePriceByPairs = (currencyA?: Currency, currencyB?: Currency) => {
  const { chainId } = useActiveChainId()
  const [tokenA, tokenB] = [currencyA?.wrapped, currencyB?.wrapped]
  const pairAddress = getLpAddress(tokenA, tokenB)

  const { data: reserves } = useReadContract({
    query: {
      enabled: Boolean(pairAddress),
    },
    chainId,
    abi: lpTokenABI,
    address: pairAddress ?? undefined,
    functionName: 'getReserves',
  })

  if (!tokenA || !tokenB) return undefined

  const reserve0 = reserves?.[0]
  const reserve1 = reserves?.[1]

  const [token0, token1] = tokenA?.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  const pair = new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0?.toString() ?? token0 === tokenB ? "1" : "0"),
    CurrencyAmount.fromRawAmount(token1, reserve1?.toString() ?? token0 === tokenA ? "1" : "0"),
  )

  return pair.priceOf(tokenB)
}

export const useBUSDCurrencyAmount = (currency?: Currency, amount?: number): number | undefined => {
  const busdPrice = useBUSDPrice(currency)
  if (!amount) {
    return undefined
  }
  if (busdPrice) {
    return multiplyPriceByAmount(busdPrice, amount)
  }
  return undefined
}

export const useBUSDCakeAmount = (amount: number): number | undefined => {
  const cakeBusdPrice = useCakeBusdPrice()
  if (cakeBusdPrice) {
    return multiplyPriceByAmount(cakeBusdPrice, amount)
  }
  return undefined
}

// @Note: only fetch from one pair
export const useCakeBusdPrice = (): Price<ERC20Token, ERC20Token> | undefined => {
  const { chainId } = useActiveChainId()
  return usePriceByPairs(USDT[chainId], GTOKEN[chainId])
}

// @Note: only fetch from one pair
export const useBNBBusdPrice = (): Price<ERC20Token, ERC20Token> | undefined => {
  const { chainId } = useActiveChainId()
  const wnative: Token = WNATIVE[chainId]
  return usePriceByPairs(USDT[chainId], wnative)
}
