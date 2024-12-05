import { Pool } from 'libraries/v3-sdk'

const isPoolTickInRange = (pool: Pool | null, tickLower: number | undefined, tickUpper: number | undefined) => {
  const below = pool && typeof tickLower === 'number' ? pool.tickCurrent < tickLower : undefined
  const above = pool && typeof tickUpper === 'number' ? pool.tickCurrent >= tickUpper : undefined
  return typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false
}

export default isPoolTickInRange
