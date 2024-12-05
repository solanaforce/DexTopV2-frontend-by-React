import { ChainId } from 'config/chains'
import { Address } from 'viem'

// = 1 << 23 or 100000000000000000000000
export const V2_FEE_PATH_PLACEHOLDER = 8388608

export const MSG_SENDER = '0x0000000000000000000000000000000000000001'
export const ADDRESS_THIS = '0x0000000000000000000000000000000000000002'

export const MIXED_ROUTE_QUOTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x3DA76BD432c4Cd4a79eE36d5cB44bB70bf1be299',
} as const satisfies Record<ChainId, Address>

export const V3_QUOTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0xc5a7A073dD381A0b35958AB6A4780277672ccE2D',
} as const satisfies Record<ChainId, Address>
