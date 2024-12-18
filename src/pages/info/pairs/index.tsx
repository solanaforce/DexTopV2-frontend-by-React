import { useRouter } from 'next/router'
import { InfoPageLayout } from 'views/V3Info/components/Layout'
import Pool from 'views/V3Info/views/PoolPage'
import Pools from 'views/V3Info/views/PoolsPage'

const InfoPoolsPage = () => {
  const router = useRouter()
  
  const tokenAddress = router.isReady
    ? router.query.address as string || undefined
    : undefined

  if (tokenAddress)
    return <Pool address={tokenAddress} />
  
  return <Pools />
  
  
}

InfoPoolsPage.Layout = InfoPageLayout
InfoPoolsPage.chains = [] // set all

export default InfoPoolsPage
