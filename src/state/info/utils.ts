import { ChainId, CHAIN_QUERY_NAME } from 'config/chains'

import { multiChainPaths } from './constant'
import { InfoDataSource } from './types'

// TODO: refactor
// Params should be defined in object for future extension
export function getTokenInfoPath(
  chainId: ChainId,
  address: string,
  dataSource: InfoDataSource = InfoDataSource.V3,
  stableSwapPath = '',
) {
  // return `/info${dataSource === InfoDataSource.V3 ? '/v3' : ''}${multiChainPaths[chainId]}/tokens/${address}?chain=${
    return `/info${multiChainPaths[chainId]}/tokens?address=${address}&chain=${
    CHAIN_QUERY_NAME[chainId]
  }${stableSwapPath.replace('?', '&')}`
}

// TODO: refactor
export function getChainName(chainId: ChainId) {
  return 'PLS'
}
