import { ChainId } from 'config/chains'

import { StableSwapPool } from './types'

export type StableSwapPoolMap<TChainId extends number> = {
  [chainId in TChainId]: StableSwapPool[]
}

export const isStableSwapSupported = (chainId: number): chainId is StableSupportedChainId =>
  STABLE_SUPPORTED_CHAIN_IDS.includes(chainId)

export const STABLE_SUPPORTED_CHAIN_IDS: any = [56] as const

export type StableSupportedChainId = (typeof STABLE_SUPPORTED_CHAIN_IDS)[number]

export const STABLE_POOL_MAP = {} satisfies StableSwapPoolMap<StableSupportedChainId>
