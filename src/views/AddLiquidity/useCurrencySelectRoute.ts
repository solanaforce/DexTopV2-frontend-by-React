import { Currency, NATIVE, WNATIVE } from 'libraries/swap-sdk'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import currencyId from 'utils/currencyId'
import { GTOKEN } from 'libraries/tokens'
import { getAddress } from 'viem'

export const useCurrencySelectRoute = () => {
  const native = useNativeCurrency()
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    GTOKEN[chainId].address,
  ]

  // const handleCurrencyASelect = useCallback(
  //   (currencyA_: Currency) => {
  //     const newCurrencyIdA = currencyId(currencyA_)
  //     if (newCurrencyIdA === currencyIdB) {
  //       router.replace(`/add/v2/${currencyIdB}/${currencyIdA}`, undefined, { shallow: true })
  //     } else if (currencyIdB) {
  //       router.replace(`/add/v2/${newCurrencyIdA}/${currencyIdB}`, undefined, { shallow: true })
  //     } else {
  //       router.replace(`/add/v2/${newCurrencyIdA}`, undefined, { shallow: true })
  //     }
  //   },
  //   [currencyIdB, router, currencyIdA],
  // )
  // const handleCurrencyBSelect = useCallback(
  //   (currencyB_: Currency) => {
  //     const newCurrencyIdB = currencyId(currencyB_)
  //     if (currencyIdA === newCurrencyIdB) {
  //       if (currencyIdB) {
  //         router.replace(`/add/v2/${currencyIdB}/${newCurrencyIdB}`, undefined, { shallow: true })
  //       } else {
  //         router.replace(`/add/v2/${newCurrencyIdB}`, undefined, { shallow: true })
  //       }
  //     } else {
  //       router.replace(`/add/v2/${currencyIdA || native.symbol}/${newCurrencyIdB}`, undefined, { shallow: true })
  //     }
  //   },
  //   [currencyIdA, router, currencyIdB, native],
  // )

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      }
      // prevent weth + eth
      const isETHOrWETHNew =
        currencyNew?.isNative || (chainId !== undefined && currencyIdNew === WNATIVE[chainId]?.address)
      const isETHOrWETHOther =
        currencyIdOther !== undefined &&
        (currencyIdOther === NATIVE[chainId]?.symbol ||
          (chainId !== undefined && getAddress(currencyIdOther) === WNATIVE[chainId]?.address))

      if (isETHOrWETHNew && isETHOrWETHOther) {
        return [currencyIdNew, undefined]
      }

      return [currencyIdNew, currencyIdOther]
    },
    [chainId],
  )

  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idA!],
            },
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idA!, idB!],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [handleCurrencySelect, currencyIdB, router],
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idB!],
            },
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              currency: [idA!, idB!],
            },
          },
          undefined,
          { shallow: true },
        )
      }
    },
    [handleCurrencySelect, currencyIdA, router],
  )

  return {
    handleCurrencyASelect,
    handleCurrencyBSelect,
  }
}
