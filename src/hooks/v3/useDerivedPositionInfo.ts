import { Pool, Position } from 'libraries/v3-sdk'
import { useCurrency } from 'hooks/Tokens'
import { PositionDetails } from 'libraries/farms'
import { usePool } from './usePools'

export function useDerivedPositionInfo(positionDetails: PositionDetails | undefined): {
  position: Position | undefined
  pool: Pool | undefined
} {
  const currency0 = useCurrency(positionDetails?.token0)
  const currency1 = useCurrency(positionDetails?.token1)

  // construct pool data
  const [, pool] = usePool(currency0 ?? undefined, currency1 ?? undefined, positionDetails?.fee)

  let position

  if (pool && positionDetails) {
    position = new Position({
      pool,
      liquidity: positionDetails.liquidity.toString(),
      tickLower: positionDetails.tickLower,
      tickUpper: positionDetails.tickUpper,
    })
  }

  return {
    position,
    pool: pool ?? undefined,
  }
}
