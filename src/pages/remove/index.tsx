import { CHAIN_IDS } from 'utils/wagmi'
import RemoveLiquidityFormProvider from 'views/RemoveLiquidityV3/form/RemoveLiquidityFormProvider'
import RemoveLiquidity from 'views/RemoveLiquidityV3'
import { useTokenIdParams } from 'views/RemoveLiquidityV3/hooks/useTokenIdParams'

const RemoveLiquidityPage = () => {
  const { tokenId } = useTokenIdParams()
  return (
    <RemoveLiquidityFormProvider>
      <RemoveLiquidity tokenId={tokenId} />
    </RemoveLiquidityFormProvider>
  )
}

RemoveLiquidityPage.chains = CHAIN_IDS

export default RemoveLiquidityPage
