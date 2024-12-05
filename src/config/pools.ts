import { ChainId } from 'config/chains'

// Revalidate interval in milliseconds
export const POOLS_FAST_REVALIDATE = {
  [ChainId.ETHEREUM]: 20_000,
} as const satisfies Record<ChainId, number>

// Revalidate interval in milliseconds
export const POOLS_NORMAL_REVALIDATE = {
  [ChainId.ETHEREUM]: 20_000,
} as const satisfies Record<ChainId, number>

export const POOLS_SLOW_REVALIDATE = {
  [ChainId.ETHEREUM]: 40_000,
} as const satisfies Record<ChainId, number>
