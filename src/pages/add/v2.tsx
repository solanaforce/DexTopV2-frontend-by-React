import { useCurrency } from 'hooks/Tokens'

import { useRouter } from 'next/router'
import { useEffect, useCallback } from 'react'
import AddLiquidity from 'views/AddLiquidity'
import { CHAIN_IDS } from 'utils/wagmi'
import { useCurrencyParams } from 'views/AddLiquidity/hooks/useCurrencyParams'

const AddLiquidityPage = () => {
  const router = useRouter()
  const { currencyIdA, currencyIdB } = useCurrencyParams()

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

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  return <AddLiquidity currencyA={currencyA} currencyB={currencyB} />
}

AddLiquidityPage.chains = CHAIN_IDS

export default AddLiquidityPage