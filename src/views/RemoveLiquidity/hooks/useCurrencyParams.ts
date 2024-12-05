import { USDC, USDT } from 'libraries/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'

export function useCurrencyParams(): {
  currencyIdA: string | undefined
  currencyIdB: string | undefined
} {
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.isReady
    ? router.query.currency || [
        native.symbol,
        USDT[chainId]?.address || USDC[chainId]?.address,
      ]
    : [undefined, undefined, undefined]

  return { currencyIdA, currencyIdB }
}
