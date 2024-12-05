import { ChainId } from 'config/chains'
import { ERC20Token } from 'libraries/swap-sdk'

export const GTOKEN_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x57953dAC106a4cDa11D90273b1B9D59E169533c0',
  18,
  'DEX',
  'DexTop',
  'https://dextop.pro/',
)

export const USDC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07',
  6,
  'USDC',
  'USD Coin from Ethereum',
)

export const USDT_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f',
  6,
  'USDT',
  'Tether USD from Ethereum',
  'https://tether.to/',
)

export const DAI_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xefD766cCb38EaF1dfd701853BFCe31359239F305',
  18,
  'DAI',
  'Dai Stablecoin from Ethereum',
  'https://makerdao.com/',
)

export const WBTC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xb17D901469B9208B17d916112988A3FeD19b5cA1',
  8,
  'WBTC',
  'Wrapped BTC from Ethereum',
)

export const GTOKEN = {
  [ChainId.ETHEREUM]: GTOKEN_ETH,
}

export const USDC = {
  [ChainId.ETHEREUM]: USDC_ETH,
}

export const USDT = {
  [ChainId.ETHEREUM]: USDT_ETH,
}

export const DAI = {
  [ChainId.ETHEREUM]: DAI_ETH,
}
