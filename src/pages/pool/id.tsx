import { useRouter } from 'next/router'
import { CHAIN_IDS } from 'utils/wagmi'
import PoolPage from 'views/Liquidity/V3Pool'
import { useTokenIdParams } from 'views/RemoveLiquidityV3/hooks/useTokenIdParams'

const PoolItemPage = () => {
	const { tokenId } = useTokenIdParams()

	const parsedTokenId = tokenId ? BigInt(tokenId as string) : undefined

	return <PoolPage parsedTokenId={parsedTokenId} />
}

PoolItemPage.chains = CHAIN_IDS

export default PoolItemPage