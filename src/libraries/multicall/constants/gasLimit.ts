import { ChainId } from 'config/chains'

export const DEFAULT_GAS_LIMIT = 150000000n

export const DEFAULT_GAS_LIMIT_BY_CHAIN: { [key in ChainId]?: bigint } = {
  [ChainId.ETHEREUM]: 100000000n,
}

export const DEFAULT_GAS_BUFFER = 3000000n

export const DEFAULT_GAS_BUFFER_BY_CHAIN: { [key in ChainId]?: bigint } = {
  [ChainId.ETHEREUM]: DEFAULT_GAS_BUFFER,
}
