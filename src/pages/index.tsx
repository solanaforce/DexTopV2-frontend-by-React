import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetStaticProps } from 'next'
import { CHAIN_IDS } from 'utils/wagmi'
import V3Swap from 'views/Swap/V3Swap'

const IndexPage = () => {
  return <V3Swap />
}

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient()
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60, // 1 hour
  }
}

IndexPage.chains = CHAIN_IDS

export default IndexPage
