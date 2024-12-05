import memoize from 'lodash/memoize'

import {
  Chain,
  pulsechain
} from 'wagmi/chains'

export enum ChainId {
  ETHEREUM = 369,
}

export const CHAIN_QUERY_NAME: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'pulse',
}

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const CHAINS: [Chain, ...Chain[]] = [
  pulsechain
]

export const PUBLIC_NODES: Record<ChainId, string[] | readonly string[]> = {
  [ChainId.ETHEREUM]: [
    ...pulsechain.rpcUrls.default.http,
    // 'https://ethereum.publicnode.com',
    // 'https://eth.llamarpc.com',
  ],
}

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})