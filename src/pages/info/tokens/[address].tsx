import { useRouter } from 'next/router'
import Token from 'views/V3Info/views/TokenPage'
import { InfoPageLayout } from 'views/V3Info/components/Layout'

const TokenPage = () => {
  const router = useRouter()

  const { address: tokenId } = router.query

	const parsedTokenId = tokenId ? tokenId as string : ""
  console.log(parsedTokenId)

  return <Token address={parsedTokenId} />
}

TokenPage.Layout = InfoPageLayout
TokenPage.chains = [] // set all

export default TokenPage
