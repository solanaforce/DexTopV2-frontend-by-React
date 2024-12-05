import { TradeType } from 'libraries/swap-sdk'
import { SmartRouterTrade } from 'libraries/smart-router/evm'
import { useMemo } from 'react'
import { useUserSlippage } from 'utils/user'
import { computeSlippageAdjustedAmounts } from '../utils/exchange'

export function useSlippageAdjustedAmounts(trade?: SmartRouterTrade<TradeType>) {
  const [allowedSlippage] = useUserSlippage()
  return useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [allowedSlippage, trade])
}
