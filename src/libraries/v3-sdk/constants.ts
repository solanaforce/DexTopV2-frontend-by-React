import { ChainId } from 'config/chains'
import { Address, Hash } from 'viem'

const FACTORY_ADDRESS = '0x393A4633eF82E937FeA227254257b173325C62c0'

/**
 * To compute Pool address use DEPLOYER_ADDRESSES instead
 */
export const FACTORY_ADDRESSES = {
  [ChainId.ETHEREUM]: FACTORY_ADDRESS,
} as const satisfies Record<ChainId, Address>

const DEPLOYER_ADDRESS = '0xC92deD6e688F67E91F332bF18D8F374Be6cD615c'

export const DEPLOYER_ADDRESSES = {
  [ChainId.ETHEREUM]: DEPLOYER_ADDRESS,
} as const satisfies Record<ChainId, Address>

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

const POOL_INIT_CODE_HASH = '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2'

export const POOL_INIT_CODE_HASHES = {
  [ChainId.ETHEREUM]: POOL_INIT_CODE_HASH,
} as const satisfies Record<ChainId, Hash>

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 2500,
  HIGH = 10000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 50,
  [FeeAmount.HIGH]: 200,
}
