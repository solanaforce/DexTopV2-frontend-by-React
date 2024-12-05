import { useCurrency } from 'hooks/Tokens'
import { CHAIN_IDS } from 'utils/wagmi'
import RemoveLiquidity from 'views/RemoveLiquidity'
import { useCurrencyParams } from 'views/RemoveLiquidity/hooks/useCurrencyParams'

const RemoveLiquidityPage = () => {
  const { currencyIdA, currencyIdB } = useCurrencyParams()

  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]

  const props = {
    currencyIdA,
    currencyIdB,
    currencyA,
    currencyB,
  }

  return <RemoveLiquidity {...props} />
}

RemoveLiquidityPage.chains = CHAIN_IDS

export default RemoveLiquidityPage