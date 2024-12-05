import { AutoColumn, Text, Skeleton, Card, Box } from 'components'
import { promotedGradient } from 'utils/animationToolkit'
import { FeeAmount } from 'libraries/v3-sdk'
// import { LightTertiaryCard } from 'components/Card'
import { PoolState } from 'hooks/v3/types'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import styled, { css } from 'styled-components'

import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL } from './shared'

export const LightTertiaryCard = styled(Box)<{ active: boolean }>`
  &:hover {
    opacity: 0.7;
  }
  animation: ${promotedGradient} 4s ease infinite;
  cursor: pointer;
  border: 1px solid ${({ theme, active }) => (active ? 'none' : theme.colors.cardBorder)};
  background: ${({ theme, active }) => (active ? theme.colors.backgroundAlt : theme.colors.backgroundAlt2)};
`

const FeeOptionContainer = styled.div<{ active: boolean }>`
  cursor: pointer;
  height: 100%;
  animation: ${promotedGradient} 4s ease infinite;
  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.colors.backgroundAlt};
    `}
  border-radius: 8px;
  padding: 2px 2px 4px 2px;
  &:hover {
    opacity: 0.7;
  }
`

interface FeeOptionProps {
  feeAmount: FeeAmount
  largestUsageFeeTier?: FeeAmount
  active: boolean
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
  onClick: () => void
  isLoading?: boolean
}

export function FeeOption({
  feeAmount,
  active,
  poolState,
  distributions,
  onClick,
  largestUsageFeeTier,
  isLoading,
}: FeeOptionProps) {
  return (
    // <FeeOptionContainer active={active} onClick={onClick}>
      <LightTertiaryCard active={active} padding={['4px', '4px', '8px']} onClick={onClick}>
        <AutoColumn gap="sm" justify="flex-start" height="100%" justifyItems="center">
          <Text textAlign="center">
            {FEE_AMOUNT_DETAIL[feeAmount].label}% {feeAmount === largestUsageFeeTier && '🔥'}
          </Text>
          {isLoading ? (
            <Skeleton width="100%" height={16} />
          ) : distributions ? (
            <FeeTierPercentageBadge distributions={distributions} feeAmount={feeAmount} poolState={poolState} />
          ) : null}
        </AutoColumn>
      </LightTertiaryCard>
    // </FeeOptionContainer>
  )
}
