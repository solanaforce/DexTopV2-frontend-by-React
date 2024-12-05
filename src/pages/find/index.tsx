import { CHAIN_IDS } from 'utils/wagmi'
import PoolFinder from 'views/PoolFinder'

const PoolFinderPage = () => <PoolFinder />

PoolFinderPage.chains = CHAIN_IDS

export default PoolFinderPage

// import { NotFound } from 'components/NotFound'
// import { NextSeo } from 'next-seo'
// import Link from 'next/link'

// const NotFoundPage = () => (
//   <NotFound LinkComp={Link}>
//     <NextSeo title="404" />
//   </NotFound>
// )

// NotFoundPage.chains = []

// export default NotFoundPage