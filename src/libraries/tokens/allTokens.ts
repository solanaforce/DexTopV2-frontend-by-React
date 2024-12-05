import { ChainId } from 'config/chains'

import { ethereumTokens } from './constants/eth'

export const allTokens = {
  [ChainId.ETHEREUM]: ethereumTokens,
}
