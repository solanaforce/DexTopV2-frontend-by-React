import { ChainId } from 'config/chains'
import { Token } from 'libraries/swap-sdk'

import { usdGasTokensByChain } from '../../constants'

export function getUsdGasToken(chainId: ChainId): Token | null {
  return usdGasTokensByChain[chainId]?.[0] ?? null
}
