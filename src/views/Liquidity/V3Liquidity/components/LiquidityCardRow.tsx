import { Text, Card, Flex, Tag, SyncAltIcon, Box } from 'components'
import NextLink from 'next/link'
import styled from 'styled-components'

import DoubleCurrencyLogo from 'components/Logo/DoubleLogo'
import { Percent, Currency } from 'libraries/swap-sdk'

const TagCell = styled(Flex)`
  padding: 8px 0;

  // ${({ theme }) => theme.mediaQueries.sm} {
  //   position: absolute;
  //   right: 16px;
  //   top: 30%;
  // }
`

const StyledFlex = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 2px 8px;
  background-color: ${({theme}) => theme.colors.input};
  border-radius: 12px;
`

const StyledBox = styled(Box)`
  border: 1px solid ${({theme}) => theme.colors.backgroundAlt2};
  border-radius: 12px;
  &:hover {
    border: 1px solid ${({theme}) => theme.colors.backgroundAlt};
  }
`

interface LiquidityCardRowProps {
  link?: string
  currency0: Currency
  currency1: Currency
  pairText: string | React.ReactElement
  feeAmount?: number
  tokenId?: bigint
  tags: React.ReactElement
  subtitle: string
  onSwitch?: () => void
}

export const LiquidityCardRow = ({
  link,
  currency0,
  currency1,
  pairText,
  feeAmount,
  tags,
  subtitle,
  tokenId,
  onSwitch,
}: LiquidityCardRowProps) => {
  const content = (
    <StyledFlex>
      <Flex flexDirection="column" width="100%">
        <Flex alignItems="center" justifyContent="space-between" mt="4px" width="100%">
          <Flex width={['100%', '100%', 'inherit']} pr="8px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text ml="8px">
              {pairText}
            </Text>
            {typeof tokenId !== 'undefined' && <Text mr="8px">{` (#${tokenId.toString()})`}</Text>}
          </Flex>
          <Flex alignItems="center">
            <TagCell>{tags}</TagCell>
            {!!feeAmount && (
              <Tag variant="secondary" ml="8px" outline>
                {new Percent(feeAmount, 1_000_000).toSignificant()}%
              </Tag>
            )}
          </Flex>
        </Flex>
        <Flex>
          <Text fontSize="14px" color="textSubtle">
            {subtitle}
          </Text>
          {onSwitch ? (
            <SyncAltIcon
              onClick={(e) => {
                e.preventDefault()
                onSwitch()
              }}
              ml="4px"
              color="primary"
            />
          ) : null}
        </Flex>
      </Flex>
    </StyledFlex>
  )

  if (link) {
    return (
      <StyledBox mb="4px">
        <NextLink href={link}>{content}</NextLink>
      </StyledBox>
    )
  }

  // return <Card mb="4px">{content}</Card>
  return content
}
