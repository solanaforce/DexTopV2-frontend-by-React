import { Currency, CurrencyAmount } from 'libraries/swap-sdk'

export interface GasCost {
  gasEstimate: bigint
  // The gas cost in terms of the quote token.
  gasCostInToken: CurrencyAmount<Currency>
  gasCostInUSD: CurrencyAmount<Currency>
}
