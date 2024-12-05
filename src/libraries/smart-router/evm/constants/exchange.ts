import { ChainId } from 'config/chains'
import { Token, WNATIVE } from 'libraries/swap-sdk'
import {
  USDC,
  USDT,
  WBTC_ETH,
  ethereumTokens,
} from 'libraries/tokens'

import { ChainMap, ChainTokenList } from '../types'

export const SMART_ROUTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x779dA937300a8f1F859a1a33E1d8E408885B1341',
} as const satisfies Record<ChainId, string>

export const V2_ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0x2221EEa96821E537F100C711dE439F79451c6A01',
}

export const STABLE_SWAP_INFO_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '',
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {
  [ChainId.ETHEREUM]: {},
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] }
} = {}
