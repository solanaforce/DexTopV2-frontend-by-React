import styled from 'styled-components'
import { useCallback, useMemo } from 'react'
import { ArrowDownIcon, ArrowUpDownIcon, Box, Button, Flex, IconButton } from 'components'
import Page from 'components/Layout/Page'
import { AppBody } from 'components/App'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useSwapState } from 'state/swap/hooks'
import { useWeb3React } from 'libraries/wagmi'
import { useCurrency } from 'hooks/Tokens'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Currency, Percent } from 'libraries/swap-sdk-core'
import currencyId from 'utils/currencyId'
import replaceBrowserHistory from 'utils/replaceBrowserHistory'
import { formatAmount } from 'utils/formatFractions'
import { CommonBasesType } from 'components/SearchModal/types'
import { AutoRow } from 'components/Layout/Row'
import { iconDownClass, iconUpDownClass, switchButtonClass } from 'theme/css/SwapWidget.css'
import { useAllowRecipient, useIsWrapping, useSwapBestTrade } from './hooks'
import CurrencyInputHeader from '../components/CurrencyInputHeader'
import { Wrapper } from './components/styleds'
import { TradeDetails } from './containers/TradeDetails'
import { SwapCommitButton } from './containers/SwapCommitButton'
import { Recipient } from './containers/Recipient'

const StyledBox = styled(Box)`
  // background: rgb(27, 28, 29);
  border-radius: 8px;
`

const StyledBox1 = styled(Box)`
  padding: 9px 0;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.textDisabled};
`

function V3SwapForm() {
  const { isLoading, trade, error } = useSwapBestTrade()
  const tradeLoaded = !isLoading
  // const price = useMemo(() => trade && SmartRouter.getExecutionPrice(trade), [trade])

  const { account } = useWeb3React()
  const [inputAmount, outputAmount] = [trade?.inputAmount, trade?.outputAmount]

  const {
    recipient,
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const isWrapping = useIsWrapping()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const [inputBalance] = useCurrencyBalances(account as string, [inputCurrency, outputCurrency])
  const maxAmountInput = useMemo(() => maxAmountSpend(inputBalance), [inputBalance])
  const loadedUrlParams = useDefaultsFromURLSearch()

  const handleTypeInput = useCallback((value: string) => onUserInput(Field.INPUT, value), [onUserInput])
  const handleTypeOutput = useCallback((value: string) => onUserInput(Field.OUTPUT, value), [onUserInput])

  const handlePercentInput = useCallback(
    (percent: number) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleCurrencySelect = useCallback(
    (newCurrency: Currency, field: Field, currentInputCurrencyId: string, currentOutputCurrencyId: string) => {
      onCurrencySelection(field, newCurrency)

      const isInput = field === Field.INPUT
      const oldCurrencyId = isInput ? currentInputCurrencyId : currentOutputCurrencyId
      const otherCurrencyId = isInput ? currentOutputCurrencyId : currentInputCurrencyId
      const newCurrencyId = currencyId(newCurrency)
      if (newCurrencyId === otherCurrencyId) {
        replaceBrowserHistory(isInput ? 'outputCurrency' : 'inputCurrency', oldCurrencyId)
      }
      replaceBrowserHistory(isInput ? 'inputCurrency' : 'outputCurrency', newCurrencyId)
    },
    [onCurrencySelection],
  )
  const handleInputSelect = useCallback(
    (newCurrency: Currency) => handleCurrencySelect(newCurrency, Field.INPUT, inputCurrencyId ?? "", outputCurrencyId ?? ""),
    [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  )
  const handleOutputSelect = useCallback(
    (newCurrency: Currency) => handleCurrencySelect(newCurrency, Field.OUTPUT, inputCurrencyId ?? "", outputCurrencyId ?? ""),
    [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  )

  const isTypingInput = independentField === Field.INPUT
  const inputValue = useMemo(
    () => typedValue && (isTypingInput ? typedValue : formatAmount(inputAmount) || ''),
    [typedValue, isTypingInput, inputAmount],
  )
  const outputValue = useMemo(
    () => typedValue && (isTypingInput ? formatAmount(outputAmount) || '' : typedValue),
    [typedValue, isTypingInput, outputAmount],
  )
  const inputLoading = typedValue ? !isTypingInput && isLoading : false
  const outputLoading = typedValue ? isTypingInput && isLoading : false

  const allowRecipient = useAllowRecipient()

  return (
    <Page>
      <Flex justifyContent="center" mt="40px">
        <AppBody>
          <CurrencyInputHeader
            title='Swap'
          />
          <Wrapper id="swap-page" position="relative">
            <CurrencyInputPanel
              label={!isTypingInput && !isWrapping ? 'From (estimated)' : 'From'}
              value={isWrapping ? typedValue : inputValue}
              showMaxButton
              maxAmount={maxAmountInput}
              showQuickInputButton
              currency={inputCurrency}
              onUserInput={handleTypeInput}
              onPercentInput={handlePercentInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={outputCurrency}
              id="swap-currency-input"
              showCommonBases
              showBUSD
              commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            />
            <AutoRow justify='center' my="8px" mx="auto" zIndex="2">
              <StyledBox>
                <StyledBox1>
                  <IconButton 
                    className={switchButtonClass} 
                    variant="text"
                    onClick={() => {
                      onSwitchTokens()
                      replaceBrowserHistory('inputCurrency', outputCurrencyId)
                      replaceBrowserHistory('outputCurrency', inputCurrencyId)
                    }}
                    width="24px"
                    height="24px"
                  >
                    <ArrowDownIcon className={iconDownClass} color="primary" />
                    <ArrowUpDownIcon className={iconUpDownClass} color="primary" />
                  </IconButton>
                </StyledBox1>
              </StyledBox>
              {allowRecipient && recipient === null ? (
                <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                  + Add a send (optional)
                </Button>
              ) : null}
            </AutoRow>
            <CurrencyInputPanel
              value={isWrapping ? typedValue : outputValue}
              onUserInput={handleTypeOutput}
              label={isTypingInput && !isWrapping ? 'To (estimated)' : 'To'}
              showMaxButton={false}
              currency={outputCurrency}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={inputCurrency}
              id="swap-currency-output"
              showCommonBases
              showBUSD
              commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            />
          </Wrapper>
          <Recipient />
          <SwapCommitButton trade={trade ?? undefined} tradeError={error ?? undefined} tradeLoading={!tradeLoaded} />
          <TradeDetails loaded={tradeLoaded} trade={trade} />
        </AppBody>
      </Flex>
    </Page>
  )
}

export default V3SwapForm
