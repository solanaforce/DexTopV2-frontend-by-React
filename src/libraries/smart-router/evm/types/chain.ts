import { ChainId } from 'config/chains'
import { Token } from 'libraries/swap-sdk'

// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>
