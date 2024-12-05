import { Currency } from 'libraries/swap-sdk'
import { Button, Flex, SyncAltIcon, Text } from 'components'
import styled from 'styled-components'

const RateToggleButton = styled(Button)`
  border-radius: 8px;
  padding-left: 4px;
  padding-right: 4px;
`

export default function RateToggle({
  currencyA,
  handleRateToggle,
}: {
  currencyA: Currency | undefined
  handleRateToggle: () => void
}) {
  return currencyA ? (
    <Flex justifyContent="center" alignItems="center">
      <Text mr="4px" color="textSubtle" small>
        View prices in
      </Text>
      <RateToggleButton
        variant="secondary"
        onClick={handleRateToggle}
        startIcon={<SyncAltIcon color="primary" />}
      >
        {currencyA?.symbol}
      </RateToggleButton>
    </Flex>
  ) : null
}
