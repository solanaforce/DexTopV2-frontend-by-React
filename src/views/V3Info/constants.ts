import { ChainId } from 'config/chains'
import { ManipulateType } from 'dayjs'

export const v3InfoPath = `info`

export const POOL_HIDE: { [key: string]: string[] } = {
  // TODO: update to our own
  [ChainId.ETHEREUM]: [
    '0x86d257cdb7bc9c0df10e84c8709697f92770b335',
    '0xf8dbd52488978a79dfe6ffbd81a01fc5948bf9ee',
    '0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248',
    '0xa850478adaace4c08fc61de44d8cf3b64f359bec',
    '0x277667eb3e34f134adf870be9550e9f323d0dc24',
    '0x8c0411f2ad5470a66cb2e9c64536cfb8dcd54d51',
    '0x055284a4ca6532ecc219ac06b577d540c686669d',
    '0xb078bf211e330b5f95b7114ae845188cc36b795d',
    '0x7778797342652bd27b365962ffc7f6ece356eb57',
    '0xe9825d867e3bef05223bda609fa8ab89aef93797',
  ],
}

export const TOKEN_HIDE: { [key: string]: string[] } = {
  [ChainId.ETHEREUM]: [
    '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
    '0x7dfb72a2aad08c937706f21421b15bfc34cba9ca',
    '0x12b32f10a499bf40db334efe04226cca00bf2d9b',
    '0x160de4468586b6b2f8a92feb0c260fc6cfc743b1',
    '0xd84787a01b0cad89fbca231e6960cc0f3f18df34',
    '0xdb19f2052d2b1ad46ed98c66336a5daadeb13005',
  ],
}

export const TimeWindow: {
  [key: string]: ManipulateType
} = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
}

export const ONE_HOUR_SECONDS = 3600
export const ONE_DAY_SECONDS = 86400
export const MAX_UINT128 = 2n ** 128n - 1n

export const SUBGRAPH_START_BLOCK = {
  [ChainId.ETHEREUM]: 21000000,
}

export const NODE_REAL_ADDRESS_LIMIT = 50

export const DURATION_INTERVAL = {
  day: ONE_HOUR_SECONDS,
  week: ONE_DAY_SECONDS,
  month: ONE_DAY_SECONDS,
  year: ONE_DAY_SECONDS,
}
