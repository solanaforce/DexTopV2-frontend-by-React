import { Price, TradeType, ZERO } from 'libraries/swap-sdk'

import { SmartRouterTrade } from '../types'

export function getExecutionPrice(trade: SmartRouterTrade<TradeType> | undefined) {
  const {inputAmount, outputAmount} = trade ?? {}
  
  if (!inputAmount || !outputAmount || inputAmount?.quotient === ZERO || outputAmount?.quotient === ZERO) {
    return null
  }
  return new Price(inputAmount.currency, outputAmount.currency, inputAmount.quotient, outputAmount.quotient)
}
