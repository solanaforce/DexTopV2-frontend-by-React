import { Currency } from 'libraries/swap-sdk'
import styled from 'styled-components'
import { AutoColumn, RowBetween, RowFixed, Text, Heading, Box } from 'components'
import { Position } from 'libraries/v3-sdk'
import { DoubleCurrencyLogo } from 'components/Logo'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { ReactNode, useState, useCallback } from 'react'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { Bound } from 'config/constants/types'
import Divider from 'components/Divider'
import { RangePriceSection } from 'components/RangePriceSection'
import { formatPrice } from 'utils/formatCurrencyAmount'
import FormattedCurrencyAmount from 'views/Liquidity/V3Pool/utils/FormattedCurrencyAmount'

import { RangeTag } from '../../../../../components/RangeTag'
import RateToggle from './RateToggle'

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

export const PositionPreview = ({
  position,
  title,
  inRange,
  baseCurrencyDefault,
  ticksAtLimit,
}: {
  position: Position
  title?: ReactNode
  inRange: boolean
  baseCurrencyDefault?: Currency | undefined
  ticksAtLimit: { [bound: string]: boolean | undefined }
}) => {
  const currency0 = unwrappedToken(position.pool.token0)
  const currency1 = unwrappedToken(position.pool.token1)

  // track which currency should be base
  const [baseCurrency, setBaseCurrency] = useState(
    baseCurrencyDefault
      ? baseCurrencyDefault === currency0
        ? currency0
        : baseCurrencyDefault === currency1
        ? currency1
        : currency0
      : currency0,
  )

  const sorted = baseCurrency === currency0
  const quoteCurrency = sorted ? currency1 : currency0

  const price = sorted ? position.pool.priceOf(position.pool.token0) : position.pool.priceOf(position.pool.token1)

  const priceLower = sorted ? position.token0PriceLower : position.token0PriceUpper.invert()
  const priceUpper = sorted ? position.token0PriceUpper : position.token0PriceLower.invert()

  const price0 = useStablecoinPrice(position.pool.token0 ?? undefined, { enabled: !!position.amount0 })
  const price1 = useStablecoinPrice(position.pool.token1 ?? undefined, { enabled: !!position.amount1 })

  const handleRateChange = useCallback(() => {
    setBaseCurrency(quoteCurrency)
  }, [quoteCurrency])

  const removed = typeof position?.liquidity === 'bigint' && position?.liquidity === 0n

  return (
    <AutoColumn gap="md" style={{ marginTop: '0.5rem' }}>
      <RowBetween style={{ marginBottom: '0.5rem' }}>
        <RowFixed>
          <DoubleCurrencyLogo currency0={currency0 ?? undefined} currency1={currency1 ?? undefined} size={24} />
          <Text fontSize="20px" ml="4px">
            {currency0?.symbol}-{currency1?.symbol}
          </Text>
        </RowFixed>
        <RangeTag removed={removed} outOfRange={!inRange} />
      </RowBetween>

      <LightGreyCard>
        <AutoColumn gap="sm">
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency0} />
              <Text ml="4px">{currency0?.symbol}</Text>
            </RowFixed>
            <RowFixed>
              <Text mr="8px">
                <FormattedCurrencyAmount currencyAmount={position.amount0} />
              </Text>
            </RowFixed>
            <RowBetween justifyContent="flex-end">
              <Text fontSize="10px" color="textSubtle" ml="4px" mr="8px">
                {position.amount0 && price0
                  ? `~$${price0.quote(position.amount0?.wrapped).toFixed(2, { groupSeparator: ',' })}`
                  : ''}
              </Text>
            </RowBetween>
          </RowBetween>
          <RowBetween>
            <RowFixed>
              <CurrencyLogo currency={currency1} />
              <Text ml="4px">{currency1?.symbol}</Text>
            </RowFixed>
            <RowFixed>
              <Text mr="8px">
                <FormattedCurrencyAmount currencyAmount={position.amount1} />
              </Text>
            </RowFixed>
            <RowBetween justifyContent="flex-end">
              <Text fontSize="10px" color="textSubtle" ml="4px" mr="8px">
                {position.amount1 && price1
                  ? `~$${price1.quote(position.amount1?.wrapped).toFixed(2, { groupSeparator: ',' })}`
                  : ''}
              </Text>
            </RowBetween>
          </RowBetween>
          <Divider />
          <RowBetween>
            <Text color="textSubtle">Fee Tier</Text>
            <Text>{position?.pool?.fee / 10000}%</Text>
          </RowBetween>
        </AutoColumn>
      </LightGreyCard>

      <AutoColumn gap="md">
        <RowBetween>
          {title ? (
            <Text color="secondary" fontSize="12px" textTransform="uppercase">
              {title}
            </Text>
          ) : (
            <div />
          )}
          <RateToggle currencyA={sorted ? currency0 : currency1} handleRateToggle={handleRateChange} />
        </RowBetween>

        <RowBetween>
          <RangePriceSection
            width="48%"
            title='Min Price'
            currency0={quoteCurrency}
            currency1={baseCurrency}
            price={formatTickPrice(priceLower, ticksAtLimit, Bound.LOWER, "en-US")}
          />
          <RangePriceSection
            width="48%"
            title='Max Price'
            currency0={quoteCurrency}
            currency1={baseCurrency}
            price={formatTickPrice(priceUpper, ticksAtLimit, Bound.UPPER, "en-US")}
          />
        </RowBetween>
        <RangePriceSection
          title='Current Price'
          currency0={quoteCurrency}
          currency1={baseCurrency}
          price={formatPrice(price, 6, "en-US")}
        />
      </AutoColumn>
    </AutoColumn>
  )
}
