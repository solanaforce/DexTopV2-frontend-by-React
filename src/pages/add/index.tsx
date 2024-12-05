import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { CHAIN_IDS } from 'utils/wagmi'
import { AddLiquidityV3Layout, UniversalAddLiquidity } from 'views/AddLiquidityV3'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useCurrencyParams } from 'views/AddLiquidityV3/hooks/useCurrencyParams'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { currencyIdA, currencyIdB, feeAmount } = useCurrencyParams()

  const handleRefresh = useCallback(() => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          currency: [currencyIdA!, currencyIdB!],
        },
      },
      undefined,
      { shallow: true },
    )
  }, [router, currencyIdA, currencyIdB])

  return (
    <LiquidityFormProvider>
      <AddLiquidityV3Layout
        handleRefresh={handleRefresh}
        showRefreshButton={undefined}
      >
        <UniversalAddLiquidity
          currencyIdA={currencyIdA}
          currencyIdB={currencyIdB}
          preferredSelectType={undefined}
          isV2={undefined}
          preferredFeeAmount={undefined}
        />
        {/* <V3SubgraphHealthIndicator /> */}
      </AddLiquidityV3Layout>
    </LiquidityFormProvider>
  )
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage
