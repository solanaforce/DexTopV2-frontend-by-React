import { Text, Heading, Box, BoxProps } from 'components'
import styled from 'styled-components'

const LightGreyCard = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1.25rem'};
  border: 1px solid ${({ theme }) => theme.colors.backgroundAlt};
  background-color: ${({ theme }) => theme.colors.modal};
  border-radius: ${({ borderRadius }) => borderRadius ?? '8px'};
`

export interface LightCardProps extends BoxProps {
  width?: string
  padding?: string | string[]
  border?: string
  borderRadius?: string
}

export const RangePriceSection = ({ title, currency0, currency1, price, ...props }) => {
  return (
    <LightGreyCard
      {...props}
      style={{
        paddingTop: '8px',
        paddingBottom: '8px',
        textAlign: 'center',
      }}
    >
      <Text fontSize="12px" color="secondary" textTransform="uppercase" mb="4px">
        {title}
      </Text>
      <Text fontSize="20px" mb="4px">{price}</Text>
      <Text fontSize="12px" color="textSubtle">
        {currency0?.symbol} per {currency1?.symbol}
      </Text>
    </LightGreyCard>
  )
}
