import { Tag } from 'components'
import { FeeAmount } from 'libraries/v3-sdk'
import { PoolState } from 'hooks/v3/types'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'

export function FeeTierPercentageBadge({
  feeAmount,
  distributions,
  poolState,
}: {
  feeAmount: FeeAmount
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
}) {
  return (
    <Tag
      variant="secondary"
      outline
      fontSize="12px"
      padding="2px"
      style={{
        width: 'fit-content',
        justifyContent: 'center',
        whiteSpace: 'inherit',
        alignSelf: 'flex-end',
        textAlign: 'center',
      }}
    >
      {!distributions || poolState === PoolState.NOT_EXISTS || poolState === PoolState.INVALID
        ? 'Not Created'
        : distributions[feeAmount] !== undefined
        ? `${distributions[feeAmount]?.toFixed(0)}% Pick`
        : 'No Data'}
    </Tag>
  )
}
