import { GTOKEN } from 'libraries/tokens'
import { useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { CHAIN_IDS } from 'utils/wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import IncreaseLiquidityV3 from 'views/AddLiquidityV3/IncreaseLiquidityV3'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()

  const native = useNativeCurrency()

  const [currencyIdA, currencyIdB] = router.query.currency || [
    native.symbol,
    GTOKEN[chainId].address,
  ]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  return (
    <LiquidityFormProvider>
      <IncreaseLiquidityV3 currencyA={currencyA} currencyB={currencyB} />
    </LiquidityFormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage