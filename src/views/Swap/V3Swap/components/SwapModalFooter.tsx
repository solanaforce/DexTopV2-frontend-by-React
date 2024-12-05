import { Currency, CurrencyAmount, Price, Percent, TradeType } from 'libraries/swap-sdk'
import { AutoRenewIcon, Button, QuestionHelper, Text, Link, AutoColumn } from 'components'
import { formatAmount } from 'utils/formatFractions'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { useState, memo } from 'react'
import { Field } from 'state/swap/actions'
import styled from 'styled-components'
import { warningSeverity } from 'utils/exchange'

import FormattedPriceImpact from '../../components/FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from '../../components/styleds'
import { formatExecutionPrice } from '../utils/exchange'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export const SwapModalFooter = memo(function SwapModalFooter({
  priceImpact: priceImpactWithoutFee,
  lpFee: realizedLPFee,
  inputAmount,
  outputAmount,
  tradeType,
  executionPrice,
  slippageAdjustedAmounts,
  isEnoughInputBalance,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  tradeType: TradeType
  lpFee: CurrencyAmount<Currency> | null | undefined
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  priceImpact: Percent | null | undefined
  executionPrice: Price<Currency, Currency> | null | undefined
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  isEnoughInputBalance: boolean
  onConfirm: () => void
  swapErrorMessage?: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center">
          <Text fontSize="14px">Price</Text>
          <Text
            fontSize="14px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {formatExecutionPrice(executionPrice ?? undefined, inputAmount, outputAmount, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">
              {tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sold'}
            </Text>
            <QuestionHelper
              text='Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.'
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">
              {tradeType === TradeType.EXACT_INPUT
                ? formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 4) ?? '-'
                : formatAmount(slippageAdjustedAmounts[Field.INPUT], 4) ?? '-'}
            </Text>
            <Text fontSize="14px" marginLeft="4px">
              {tradeType === TradeType.EXACT_INPUT ? outputAmount.currency.symbol : inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">Price Impact</Text>
            <QuestionHelper
              text='The difference between the market price and your price due to trade size.'
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee ?? undefined} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">Trading Fee</Text>
            <QuestionHelper
              text={
                <>
                  <Text>
                  Fee ranging from 0.1% to 0.01% depending on the pool fee tier. You can check the fee tier by clicking the magnifier icon under the “Route” section.
                  </Text>
                  <Text mt="12px">
                    <Link
                      style={{ display: 'inline' }}
                      ml="4px"
                      external
                      href="https://docs.pancakeswap.finance/products/pancakeswap-exchange/faq#what-will-be-the-trading-fee-breakdown-for-v3-exchange"
                    >
                      Fee Breakdown and Tokenomics
                    </Link>
                  </Text>
                </>
              }
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <Text fontSize="14px" textAlign="right">
            {realizedLPFee ? `${formatAmount(realizedLPFee, 6)} ${inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
          height="48px"
        >
          {severity > 2 || (tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance)
            ? 'Swap Anyway'
            : 'Confirm Swap'}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
})
