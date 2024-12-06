import { CHAINS } from 'config/chains'
import memoize from 'lodash/memoize'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi'
import { cookieStorage, createStorage } from 'wagmi'
import { publicClient } from './viem'

export const chains = CHAINS

export const noopStorage = {
  getItem: (_key: any) => '',
  setItem: (_key: any, _value: any) => {},
  removeItem: (_key: any) => {},
}

const metadata = {
  name: 'DexTop',
  description: 'DexTop offers Swap, Liquidity on Pulsechain.',
  url: 'https://dex.dextop.pro', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = defaultWagmiConfig({
  chains,
  projectId: "0b05488dcd33a3130e5f231a1d44d6f3",
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
})

createWeb3Modal({
  wagmiConfig: config,
  projectId: "3765b47410eb49f21d1ad88c620dc7f3",
  allowUnsupportedChain: false,
  chainImages: {
    369: 'https://raw.githubusercontent.com/piteasio/app-tokens/main/token-logo/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png'
  },
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true, // Optional - false as default
  themeVariables: {
    '--w3m-color-mix': '#121416',
    '--w3m-color-mix-strength': 40,
    '--w3m-accent': '#686c74',
    '--w3m-font-family': "Orbitron, sans-serif",
    '--w3m-border-radius-master': '0.5px'
  },
})

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))
export const isChainTestnet = memoize((chainId: number) => {
  const found = chains.find((c) => c.id === chainId)
  return found ? 'testnet' in found : false
})

export { publicClient }
