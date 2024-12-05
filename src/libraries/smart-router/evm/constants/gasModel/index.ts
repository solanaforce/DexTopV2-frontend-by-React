import { ChainId } from 'config/chains'
import { Token } from 'libraries/swap-sdk'
import {
  ethereumTokens,
} from 'libraries/tokens'

export const usdGasTokensByChain = {
  [ChainId.ETHEREUM]: [ethereumTokens.usdt],
} satisfies Record<ChainId, Token[]>

export * from './v2'
export * from './v3'
export * from './stableSwap'
