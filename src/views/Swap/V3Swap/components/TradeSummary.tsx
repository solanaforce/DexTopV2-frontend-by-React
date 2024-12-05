import { Currency, CurrencyAmount, Percent, TradeType } from 'libraries/swap-sdk'
import { QuestionHelper, Text, Link, AutoColumn } from 'components'
import { formatAmount } from 'utils/formatFractions'
import { memo } from 'react'

import { RowBetween, RowFixed } from 'components/Layout/Row'
import { Field } from 'state/swap/actions'
import FormattedPriceImpact from './FormattedPriceImpact'

export const TradeSummary = memo(function TradeSummary({
  inputAmount,
  outputAmount,
  tradeType,
  slippageAdjustedAmounts,
  priceImpactWithoutFee,
  realizedLPFee,
}: {
  hasStablePair?: boolean
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
  slippageAdjustedAmounts: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency>
}) {
  const isExactIn = tradeType === TradeType.EXACT_INPUT

  return (
    <AutoColumn style={{ padding: '8px' }}>
      <RowBetween>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {isExactIn ? 'Minimum received' : 'Maximum sold'}
          </Text>
          <QuestionHelper
            text='Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
            ml="4px"
            placement="top"
          />
        </RowFixed>
        <RowFixed>
          <Text fontSize="14px">
            {isExactIn
              ? `${formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 4)} ${outputAmount?.currency.symbol}` ?? '-'
              : `${formatAmount(slippageAdjustedAmounts[Field.INPUT], 4)} ${inputAmount?.currency.symbol}` ?? '-'}
          </Text>
        </RowFixed>
      </RowBetween>
      {priceImpactWithoutFee && (
        <RowBetween style={{ padding: '4px 0 0 0' }}>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              Price Impact
            </Text>
            <QuestionHelper
              text={
                <>
                  <Text fontSize="12px">
                    The difference between the market price and estimated price due to trade size.
                  </Text>
                </>
              }
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
      )}

      {realizedLPFee && (
        <RowBetween style={{ padding: '4px 0 0 0' }}>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              Trading Fee
            </Text>
            <QuestionHelper
              text={
                <>
                  <Text fontSize="12px" mb="12px">
                    Fee ranging from 0.1% to 0.01% depending on the pool fee tier.
                  </Text>
                  {/* <Text mt="12px">
                    <Link
                      style={{ display: 'inline' }}
                      ml="4px"
                      external
                      href="https://docs.pancakeswap.finance/products/pancakeswap-exchange/faq#what-will-be-the-trading-fee-breakdown-for-v3-exchange"
                    >
                      Fee Breakdown and Tokenomics
                    </Link>
                  </Text>
                  <Text mt="10px">
                    <Text bold display="inline-block">
                      MM'
                    </Text>
                    :{' '}
                    PancakeSwap does not charge any fees for trades. However, the market makers charge an implied fee of 0.05% (non-stablecoin) / 0.01% (stablecoin) factored into the quotes provided by them.
                  </Text> */}
                </>
              }
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <Text fontSize="14px">{`${formatAmount(realizedLPFee, 4)} ${inputAmount?.currency.symbol}`}</Text>
        </RowBetween>
      )}
    </AutoColumn>
  )
})
