import { CHAIN_IDS } from 'utils/wagmi'
import Swap from 'views/Swap'
import V3Swap from 'views/Swap/V3Swap'

const SwapPage = () => {
  return <V3Swap />
}

SwapPage.chains = CHAIN_IDS

export default SwapPage
