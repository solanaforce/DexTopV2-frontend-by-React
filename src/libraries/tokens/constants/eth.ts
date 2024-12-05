import { ChainId } from 'config/chains'
import { ERC20Token, WETH9 } from 'libraries/swap-sdk'
import { DAI_ETH, GTOKEN, USDC, USDT, WBTC_ETH } from './common'

export const ethereumTokens = {
  wpls: WETH9[ChainId.ETHEREUM],
  weth: new ERC20Token(
    ChainId.ETHEREUM,
    '0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C',
    18,
    'WETH',
    'Wrapped Ether from Ethereum',
  ),
  usdt: USDT[ChainId.ETHEREUM],
  usdc: USDC[ChainId.ETHEREUM],
  wbtc: WBTC_ETH,
  dai: DAI_ETH,
  gtoken: GTOKEN[ChainId.ETHEREUM],
  hex: new ERC20Token(
    ChainId.ETHEREUM,
    '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
    8,
    'HEX',
    'HEX'
  )
}
