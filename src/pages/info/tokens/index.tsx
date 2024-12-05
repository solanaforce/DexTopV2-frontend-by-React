import Tokens from 'views/V3Info/views/TokensPage'
import { InfoPageLayout } from 'views/V3Info/components/Layout'

const TokensPage = () => {
  return <Tokens />
}

TokensPage.Layout = InfoPageLayout
TokensPage.chains = [] // set all

export default TokensPage
