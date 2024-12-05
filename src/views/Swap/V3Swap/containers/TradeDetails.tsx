import styled from 'styled-components'
import { TradeType } from 'libraries/swap-sdk'
import { SmartRouter, SmartRouterTrade } from 'libraries/smart-router/evm'
import { AutoColumn } from 'components/'
import { useMemo, memo } from 'react'

import { TradeSummary } from '../components/TradeSummary'
import { RoutesBreakdown } from '../components/RoutesBreakdown'
import { useSlippageAdjustedAmounts, useIsWrapping } from '../hooks'
import { computeTradePriceBreakdown } from '../utils/exchange'

interface Props {
  loaded: boolean
  trade?: SmartRouterTrade<TradeType> | null
}

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  width: 100%;
  border-radius: 20px;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`

export const TradeDetails = memo(function TradeDetails({ loaded, trade }: Props) {
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade ?? undefined)
  const isWrapping = useIsWrapping()
  const { priceImpactWithoutFee, lpFeeAmount } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const hasStablePool = useMemo(
    () => trade?.routes.some((route) => route.pools.some(SmartRouter.isStablePool)),
    [trade],
  )

  if (isWrapping || !loaded || !trade) {
    return null
  }

  const { inputAmount, outputAmount, tradeType, routes } = trade

  return (
    <AdvancedDetailsFooter show={loaded}>
      <AutoColumn gap="0px">
        <TradeSummary
          slippageAdjustedAmounts={slippageAdjustedAmounts}
          inputAmount={inputAmount}
          outputAmount={outputAmount}
          tradeType={tradeType}
          priceImpactWithoutFee={priceImpactWithoutFee ?? undefined}
          realizedLPFee={lpFeeAmount ?? undefined}
          hasStablePair={hasStablePool}
        />
        <RoutesBreakdown routes={routes} />
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
})
