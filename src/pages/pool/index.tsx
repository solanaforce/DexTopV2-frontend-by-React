import { CHAIN_IDS } from 'utils/wagmi'
import V3Liquidity from 'views/Liquidity/V3Liquidity'

const LiquidityPage = () => <V3Liquidity />

LiquidityPage.chains = CHAIN_IDS

export default LiquidityPage
