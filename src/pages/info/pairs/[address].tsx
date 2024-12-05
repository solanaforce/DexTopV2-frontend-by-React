import { useRouter } from 'next/router'
import { InfoPageLayout } from 'views/V3Info/components/Layout'
import Pool from 'views/V3Info/views/PoolPage'

const PoolPage = () => {
  const router = useRouter()
  const { address: poolId } = router.query

	const parsedPoolId = poolId ? poolId as string : ""

  return <Pool address={parsedPoolId} />
}

PoolPage.Layout = InfoPageLayout
PoolPage.chains = [] // set all

export default PoolPage
