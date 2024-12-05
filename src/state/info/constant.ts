import { BLOCKS_CLIENT, BLOCKS_CLIENT_ETH } from 'config/constants/endpoints'
import { infoClientETH, infoClient, infoStableSwapClient, v2Clients } from 'utils/graphql'
import { GraphQLClient } from 'graphql-request'

import { ChainId } from 'config/chains'
import {
  PCS_ETH_START,
} from 'config/constants/info'
import { pulsechain } from 'wagmi/chains'

export type MultiChainName = 'PLS'

export type MultiChainNameExtend = MultiChainName

export const multiChainName: Record<number | string, MultiChainNameExtend> = {
  [ChainId.ETHEREUM]: 'PLS',
}

export const multiChainQueryMainToken: Record<MultiChainName, string> = {
  PLS: 'PLS',
}

export const multiChainBlocksClient: Record<MultiChainNameExtend, string> = {
  PLS: BLOCKS_CLIENT_ETH,
}

export const multiChainStartTime = {
  PLS: PCS_ETH_START,
}

export const multiChainId: Record<MultiChainName, ChainId> = {
  PLS: ChainId.ETHEREUM,
}

export const multiChainPaths = {
  [ChainId.ETHEREUM]: '/pulse',
}

export const multiChainQueryClient = {
  PLS: infoClientETH,
}

export const multiChainScan: Record<MultiChainName, string> = {
  PLS: pulsechain.blockExplorers.default.name,
}

export const multiChainTokenBlackList: Record<MultiChainName, string[]> = {
  PLS: [],
}

export const multiChainTokenWhiteList: Record<MultiChainName, string[]> = {
  PLS: [],
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainNameExtend): GraphQLClient => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const subgraphTokenName = {
  '0x738d96caf7096659db4c1afbf1e1bdfd281f388c': 'Ankr Staked MATIC',
  '0x14016e85a25aeb13065688cafb43044c2ef86784': 'True USD Old',
}

export const subgraphTokenSymbol = {
  '0x14016e85a25aeb13065688cafb43044c2ef86784': 'TUSDOLD',
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
