import { useRouter } from 'next/router'
import { CHAIN_IDS } from 'utils/wagmi'
import PoolPage from 'views/Liquidity/V3Pool'

const PoolItemPage = () => {
	const router = useRouter()

	const { tokenId: tokenIdFromUrl } = router.query

	const parsedTokenId = tokenIdFromUrl ? BigInt(tokenIdFromUrl as string) : undefined

	return <PoolPage parsedTokenId={parsedTokenId} />
}

PoolItemPage.chains = CHAIN_IDS

export default PoolItemPage