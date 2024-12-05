import { AutoColumn, LockIcon, Text, Card } from 'components'
import styled from 'styled-components'

export const DisableCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.disabled};
`

export default function LockedDeposit({ children, locked, ...rest }) {
  return locked ? (
    <DisableCard {...rest}>
      <AutoColumn justify="center" gap="8px">
        <LockIcon width="24px" height="24px" color="textDisabled" />
        <Text bold color="textDisabled" textAlign="center">
          The market price is outside your specified price range. Single-asset deposit only.
        </Text>
      </AutoColumn>
    </DisableCard>
  ) : (
    children
  )
}
