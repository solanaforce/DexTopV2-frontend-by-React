import { useRouter } from 'next/router'
import Tokens from 'views/V3Info/views/TokensPage'
import Token from 'views/V3Info/views/TokenPage'
import { InfoPageLayout } from 'views/V3Info/components/Layout'

const TokensPage = () => {
  const router = useRouter()
  
  const tokenAddress = router.isReady
    ? router.query.address as string || undefined
    : undefined

  if (tokenAddress)
    return <Token address={tokenAddress} />

  return <Tokens />
}

TokensPage.Layout = InfoPageLayout
TokensPage.chains = [] // set all

export default TokensPage
