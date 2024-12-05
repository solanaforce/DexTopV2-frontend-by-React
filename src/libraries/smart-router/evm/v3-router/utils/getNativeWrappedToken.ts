import { ChainId } from 'config/chains'
import { Token, WNATIVE } from 'libraries/swap-sdk'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return WNATIVE[chainId] ?? null
}
