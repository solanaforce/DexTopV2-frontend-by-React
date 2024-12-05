import { ChainId } from 'config/chains'
import { Percent } from 'libraries/swap-sdk-core'
import { ERC20Token } from './entities/token'

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const FACTORY_ADDRESS = '0x556F4C3aAa6c6b76e1BBa0409D99D4a483b29997'

export const FACTORY_ADDRESS_MAP: Record<number, `0x${string}`> = {
  [ChainId.ETHEREUM]: FACTORY_ADDRESS,
}
export const INIT_CODE_HASH = '0x67cb47473e9a281a69a651a1182bf0249f7335213e4efd0514b014638ca5a774'

export const INIT_CODE_HASH_MAP: Record<number, `0x${string}`> = {
  [ChainId.ETHEREUM]: INIT_CODE_HASH,
}

export const WETH9 = {
  [ChainId.ETHEREUM]: new ERC20Token(
    ChainId.ETHEREUM,
    '0xA1077a294dDE1B09bB078844df40758a5D0f9a27',
    18,
    'WPLS',
    'Wrapped Pulse',
    ''
  ),
}

export const WNATIVE: Record<number, ERC20Token> = {
  [ChainId.ETHEREUM]: WETH9[ChainId.ETHEREUM],
}

export const NATIVE: Record<
  number,
  {
    name: string
    symbol: string
    decimals: number
  }
> = {
  [ChainId.ETHEREUM]: { name: 'Pulse', symbol: 'PLS', decimals: 18 },
}
