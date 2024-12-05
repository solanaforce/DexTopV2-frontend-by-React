import { CommonBasesType } from 'components/SearchModal/types'

import { Currency, CurrencyAmount, Percent } from 'libraries/swap-sdk'
import {
  AutoColumn,
  Button,
  RowBetween,
  Text,
  AutoRow,
  Box,
  Message,
  MessageText,
  PreTitle,
  // DynamicSection,
  Flex,
} from 'components'
import NumericalInput from 'components/NumericalInput'
import { ConfirmationModalContent } from 'widgets/ConfirmationModalContent'
import { useModal } from 'widgets/Modal'
import { DynamicSection } from 'components/DynamicSection'
// import { logGTMClickAddLiquidityEvent } from 'utils/customGTMEventTracking'

import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { FeeAmount, NonfungiblePositionManager } from 'libraries/v3-sdk'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTransactionDeadline } from 'hooks/useTransactionDeadline'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useUserSlippage, useIsExpertMode } from 'utils/user'

import { maxAmountSpend } from 'utils/maxAmountSpend'
import { basisPointsToPercent } from 'utils/exchange'
import { Field } from 'state/mint/actions'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'

import { useTransactionAdder } from 'state/transactions/hooks'
import { useV3NFTPositionManagerContract } from 'hooks/useContracts'
import { useRouter } from 'next/router'
// import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSendTransaction, useWalletClient } from 'wagmi'
import styled from 'styled-components'
import LiquidityChartRangeInput from 'components/LiquidityChartRangeInput'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { Bound } from 'config/constants/types'
import { V3SubmitButton } from 'views/AddLiquidityV3/components/V3SubmitButton'
import { formatCurrencyAmount, formatRawAmount } from 'utils/formatCurrencyAmount'
import { QUICK_ACTION_CONFIGS } from 'views/AddLiquidityV3/types'
import { isUserRejected } from 'utils/reject'
import { hexToBigInt } from 'viem'
import { getViemClients } from 'utils/viem'
import { calculateGasMargin } from 'utils'

import { ZoomLevels, ZOOM_LEVELS } from 'components/LiquidityChartRangeInput/types'
import RangeSelector from './components/RangeSelector'
import { PositionPreview } from './components/PositionPreview'
import RateToggle from './components/RateToggle'
import LockedDeposit from './components/LockedDeposit'
import { useRangeHopCallbacks } from './form/hooks/useRangeHopCallbacks'
import { useV3MintActionHandlers } from './form/hooks/useV3MintActionHandlers'
import { useV3FormAddLiquidityCallback, useV3FormState } from './form/reducer'

const StyledInput = styled(NumericalInput)`
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme, error }) => theme.shadows[error ? 'warning' : 'inset']};
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 16px;
  width: 100%;
  margin-bottom: 16px;
`

export const HideMedium = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

export const MediumOnly = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: initial;
  }
`

export const RightContainer = styled(AutoColumn)`
  height: fit-content;

  grid-row: 2 / 3;
  grid-column: 1;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-row: 1 / 3;
    grid-column: 2;
  }
`

interface V3FormViewPropsType {
  baseCurrency?: Currency
  quoteCurrency?: Currency
  currencyIdA?: string
  currencyIdB?: string
  feeAmount?: number
}

export default function V3FormView({
  feeAmount,
  baseCurrency,
  quoteCurrency,
  currencyIdA,
  currencyIdB,
}: V3FormViewPropsType) {
  const router = useRouter()
  const { data: signer } = useWalletClient()
  const { sendTransactionAsync } = useSendTransaction()
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm
  const expertMode = useIsExpertMode()

  const positionManager = useV3NFTPositionManagerContract()
  const { account, chainId, isWrongNetwork } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  // mint state
  const formState = useV3FormState()
  const { independentField, typedValue, startPriceTypedValue, leftRangeTypedValue, rightRangeTypedValue } = formState

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  } = useV3DerivedInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    undefined,
    formState,
  )
  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput, onBothRangeInput } =
    useV3MintActionHandlers(noLiquidity)

  const isValid = !errorMessage && !invalidRange

  // modal and loading
  // capital efficiency warning
  const [showCapitalEfficiencyWarning, setShowCapitalEfficiencyWarning] = useState<boolean>(false)

  useEffect(() => {
    setShowCapitalEfficiencyWarning(false)
  }, [baseCurrency, quoteCurrency, feeAmount])

  useEffect(() => {
    if (feeAmount) {
      setActiveQuickAction(undefined)
      onBothRangeInput({
        leftTypedValue: '',
        rightTypedValue: '',
      })
    }
    // NOTE: ignore exhaustive-deps to avoid infinite re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeAmount])

  const onAddLiquidityCallback = useV3FormAddLiquidityCallback()

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [txHash, setTxHash] = useState<string>('')
  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  //   // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = useMemo(
    () =>
      [Field.CURRENCY_A, Field.CURRENCY_B].reduce((accumulator, field) => {
        return {
          ...accumulator,
          [field]: maxAmountSpend(currencyBalances[field]),
        }
      }, {}),
    [currencyBalances],
  )

  const nftPositionManagerAddress = useV3NFTPositionManagerContract()?.address
  // check whether the user has approved the router on the tokens
  const {approvalState: approvalA, approveCallback: approveACallback} = useApproveCallback(parsedAmounts[Field.CURRENCY_A], nftPositionManagerAddress)
  const {approvalState: approvalB, approveCallback: approveBCallback} = useApproveCallback(parsedAmounts[Field.CURRENCY_B], nftPositionManagerAddress)

  const [allowedSlippage] = useUserSlippage() // custom from users

  const onAdd = useCallback(async () => {
    if (!chainId || !signer || !account || !nftPositionManagerAddress) return

    if (!positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined

      const { calldata, value } = NonfungiblePositionManager.addCallParameters(position, {
        slippageTolerance: basisPointsToPercent(allowedSlippage),
        recipient: account,
        deadline: deadline[0]?.toString() ?? "0",
        useNative,
        createPool: noLiquidity,
      })

      setAttemptingTxn(true)
      const txn = {
        data: calldata,
        to: nftPositionManagerAddress,
        value: hexToBigInt(value),
        account,
      }
      getViemClients({ chainId })
        .estimateGas(txn)
        .then((gas) => {
          sendTransactionAsync({
            ...txn,
            gas: calculateGasMargin(gas),
          })
            .then((response) => {
              const baseAmount = formatRawAmount(
                parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
                baseCurrency.decimals,
                4,
              )
              const quoteAmount = formatRawAmount(
                parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
                quoteCurrency.decimals,
                4,
              )

              setAttemptingTxn(false)
              addTransaction({hash: response}, {
                type: 'add-liquidity-v3',
                summary: `Add ${baseAmount} ${baseCurrency?.symbol} and ${quoteAmount} ${quoteCurrency?.symbol}`,
              })
              setTxHash(response)
              onAddLiquidityCallback(response)
            })
            .catch((error) => {
              console.error('Failed to send transaction', error)
              setAttemptingTxn(false)
              // we only care if the error is something _other_ than the user rejected the tx
              if (!isUserRejected(error)) {
                console.error(error)
              }
            })
        })
        .catch((reason) => {
          console.error("failed to estimate gas", reason)
          setAttemptingTxn(false)
          if (!isUserRejected(reason)) {
            console.error(reason)
          }
        })
    }
  }, [
    account,
    addTransaction,
    allowedSlippage,
    baseCurrency,
    chainId,
    deadline,
    nftPositionManagerAddress,
    noLiquidity,
    onAddLiquidityCallback,
    parsedAmounts,
    position,
    positionManager,
    quoteCurrency,
    sendTransactionAsync,
    signer,
  ])

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])
  // const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks
  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool)
  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA = approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB = approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

  const translationData = useMemo(
    () => ({
      amountA: !depositADisabled ? formatCurrencyAmount(parsedAmounts[Field.CURRENCY_A], 4, "en-US") : '',
      symbolA: !depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : '',
      amountB: !depositBDisabled ? formatCurrencyAmount(parsedAmounts[Field.CURRENCY_B], 4, "en-US") : '',
      symbolB: !depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : '',
    }),
    [depositADisabled, depositBDisabled, parsedAmounts, "en-US", currencies],
  )

  const pendingText = useMemo(
    () =>
      !outOfRange
        ? `Supplying ${translationData.amountA} ${translationData.symbolA} and ${translationData.amountB} ${translationData.symbolB}`
        : `Supplying ${translationData.amountA} ${translationData.symbolA} ${translationData.amountB} ${translationData.symbolB}`,
    [outOfRange, translationData],
  )

  const [activeQuickAction, setActiveQuickAction] = useState<number>()
  const isQuickButtonUsed = useRef(false)

  const [onPresentAddLiquidityModal] = useModal(
    <TransactionConfirmationModal
      minWidth={['100%', null, '420px']}
      title='Add Liquidity'
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={() => (
        <ConfirmationModalContent
          topContent={() =>
            position ? (
              <PositionPreview
                position={position}
                inRange={!outOfRange}
                ticksAtLimit={ticksAtLimit}
                baseCurrencyDefault={baseCurrency}
              />
            ) : null
          }
          bottomContent={() => (
            <Button width="100%" mt="16px" height="48px" variant="primary" onClick={onAdd}>
              Add
            </Button>
          )}
        />
      )}
      pendingText={pendingText}
    />,
    true,
    true,
    'TransactionConfirmationModal',
  )

  // const addIsWarning = useIsTransactionWarning(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const handleButtonSubmit = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    expertMode ? onAdd() : onPresentAddLiquidityModal()
    // logGTMClickAddLiquidityEvent()
  }, [expertMode, onAdd, onPresentAddLiquidityModal])

  const buttons = (
    <V3SubmitButton
      addIsUnsupported={false}
      addIsWarning={false}
      account={account ?? undefined}
      isWrongNetwork={isWrongNetwork}
      approvalA={approvalA}
      approvalB={approvalB}
      isValid={isValid}
      showApprovalA={showApprovalA}
      approveACallback={approveACallback}
      currencies={currencies}
      approveBCallback={approveBCallback}
      showApprovalB={showApprovalB}
      parsedAmounts={parsedAmounts}
      onClick={handleButtonSubmit}
      attemptingTxn={attemptingTxn}
      errorMessage={errorMessage}
      buttonText='Add'
      depositADisabled={depositADisabled}
      depositBDisabled={depositBDisabled}
    />
  )

  useEffect(() => {
    if (!isQuickButtonUsed.current && activeQuickAction) {
      setActiveQuickAction(undefined)
    } else if (isQuickButtonUsed.current) {
      isQuickButtonUsed.current = false
    }
  }, [isQuickButtonUsed, activeQuickAction, leftRangeTypedValue, rightRangeTypedValue])

  const handleRefresh = useCallback(
    (zoomLevel?: ZoomLevels) => {
      setActiveQuickAction(undefined)
      const currentPrice = price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined
      if (currentPrice) {
        onBothRangeInput({
          leftTypedValue: (
            currentPrice * (zoomLevel?.initialMin ?? ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM].initialMin)
          ).toString(),
          rightTypedValue: (
            currentPrice * (zoomLevel?.initialMax ?? ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM].initialMax)
          ).toString(),
        })
      }
    },
    [price, feeAmount, invertPrice, onBothRangeInput],
  )

  return (
    <>
      <DynamicSection
        style={{
          gridAutoRows: 'max-content',
          gridAutoColumns: '100%',
        }}
        disabled={!feeAmount || invalidPool || (noLiquidity && !startPriceTypedValue) || (!priceLower && !priceUpper)}
      >
        <Text color="secondary" fontSize="12px" textTransform="uppercase" mb="8px">Deposit Amount</Text>

        <LockedDeposit locked={depositADisabled} mb="16px">
          <CurrencyInputPanel
            showBUSD
            maxAmount={maxAmounts[Field.CURRENCY_A]}
            onMax={() => onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')}
            onPercentInput={(percent) =>
              onFieldAInput(maxAmounts[Field.CURRENCY_A]?.multiply(new Percent(percent, 100))?.toExact() ?? '')
            }
            disableCurrencySelect
            value={formattedAmounts[Field.CURRENCY_A]}
            onUserInput={onFieldAInput}
            showQuickInputButton
            showMaxButton
            currency={currencies[Field.CURRENCY_A]}
            id="add-liquidity-input-tokena"
            showCommonBases
            commonBasesType={CommonBasesType.LIQUIDITY}
          />
        </LockedDeposit>
        <Box minHeight="3px" />
        <LockedDeposit locked={depositBDisabled} mb="8px">
          <CurrencyInputPanel
            showBUSD
            maxAmount={maxAmounts[Field.CURRENCY_B]}
            onMax={() => onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')}
            onPercentInput={(percent) =>
              onFieldBInput(maxAmounts[Field.CURRENCY_B]?.multiply(new Percent(percent, 100))?.toExact() ?? '')
            }
            disableCurrencySelect
            value={formattedAmounts[Field.CURRENCY_B]}
            onUserInput={onFieldBInput}
            showQuickInputButton
            showMaxButton
            currency={currencies[Field.CURRENCY_B]}
            id="add-liquidity-input-tokenb"
            showCommonBases
            commonBasesType={CommonBasesType.LIQUIDITY}
          />
        </LockedDeposit>
      </DynamicSection>
      <HideMedium>{buttons}</HideMedium>

      <RightContainer>
        <AutoColumn gap="16px">
          {noLiquidity && (
            <Box>
              <Text color="secondary" fontSize="12px" textTransform="uppercase" mb="8px">Set Starting Price</Text>
              <Message variant="warning" mb="8px">
                <MessageText>
                  This pool must be initialized before you can add liquidity. To initialize, select a starting price for the pool. Then, enter your liquidity price range and deposit amount. Gas fees will be higher than usual due to the initialization transaction.
                  <br />
                  <br />

                  <b>Fee-on transfer tokens and rebasing tokens are NOT compatible with V3.</b>
                </MessageText>
              </Message>
              <StyledInput className="start-price-input" value={startPriceTypedValue} onUserInput={onStartPriceInput} />
              <AutoRow justifyContent="space-between" mb="24px">
                <Text>Current ${baseCurrency?.symbol} Price:</Text>
                <Text>
                  {price ? (invertPrice ? price?.invert()?.toSignificant(5) : price?.toSignificant(5)) : '-'}
                  <span style={{ marginLeft: '4px' }}>{quoteCurrency?.symbol}</span>
                </Text>
              </AutoRow>
            </Box>
          )}
          <DynamicSection disabled={!feeAmount || invalidPool}>
            <RowBetween mb="8px">
              <Text color="secondary" fontSize="12px" textTransform="uppercase">Set Price Range</Text>
              <RateToggle
                currencyA={baseCurrency}
                handleRateToggle={() => {
                  if (!ticksAtLimit[Bound.LOWER] && !ticksAtLimit[Bound.UPPER]) {
                    onLeftRangeInput((invertPrice ? priceLower : priceUpper?.invert())?.toSignificant(6) ?? '')
                    onRightRangeInput((invertPrice ? priceUpper : priceLower?.invert())?.toSignificant(6) ?? '')
                    onFieldAInput(formattedAmounts[Field.CURRENCY_B] ?? '')
                  }

                  router.replace(
                    {
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        currency: [currencyIdB!, currencyIdA!, feeAmount ? feeAmount.toString() : ''],
                      },
                    },
                    undefined,
                    {
                      shallow: true,
                    },
                  )
                }}
              />
            </RowBetween>

            {!noLiquidity && (
              <>
                {price && baseCurrency && quoteCurrency && !noLiquidity && (
                  <AutoRow
                    gap="4px"
                    marginBottom={['24px', '0px']}
                    justifyContent="center"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <Text fontWeight={500} textAlign="center" fontSize={12} color="text1">
                      Current Price:
                    </Text>
                    <Text fontWeight={500} textAlign="center" fontSize={12} color="text1">
                      {invertPrice ? price.invert().toSignificant(6) : price.toSignificant(6)}
                    </Text>
                    <Text color="text2" fontSize={12}>
                      {quoteCurrency?.symbol} per {baseCurrency.symbol}
                    </Text>
                  </AutoRow>
                )}
                <LiquidityChartRangeInput
                  zoomLevel={QUICK_ACTION_CONFIGS?.[feeAmount!]?.[activeQuickAction!]}
                  key={baseCurrency?.wrapped?.address}
                  currencyA={baseCurrency ?? undefined}
                  currencyB={quoteCurrency ?? undefined}
                  feeAmount={feeAmount}
                  ticksAtLimit={ticksAtLimit}
                  price={price ? parseFloat((invertPrice ? price.invert() : price).toSignificant(8)) : undefined}
                  priceLower={priceLower}
                  priceUpper={priceUpper}
                  onBothRangeInput={onBothRangeInput}
                  onLeftRangeInput={onLeftRangeInput}
                  onRightRangeInput={onRightRangeInput}
                  interactive
                />
              </>
            )}
          </DynamicSection>

          <DynamicSection disabled={!feeAmount || invalidPool || (noLiquidity && !startPriceTypedValue)} gap="16px">
            <RangeSelector
              priceLower={priceLower}
              priceUpper={priceUpper}
              getDecrementLower={getDecrementLower}
              getIncrementLower={getIncrementLower}
              getDecrementUpper={getDecrementUpper}
              getIncrementUpper={getIncrementUpper}
              onLeftRangeInput={onLeftRangeInput}
              onRightRangeInput={onRightRangeInput}
              currencyA={baseCurrency}
              currencyB={quoteCurrency}
              feeAmount={feeAmount}
              ticksAtLimit={ticksAtLimit}
            />
            {showCapitalEfficiencyWarning ? (
              <Message variant="warning">
                <Box>
                  <Text fontSize="16px">Efficiency Comparison</Text>
                  <Text color="textSubtle">
                    Full range positions may earn less fees than concentrated positions.
                  </Text>
                  <Button
                    mt="16px"
                    onClick={() => {
                      setShowCapitalEfficiencyWarning(false)
                      getSetFullRange()
                    }}
                    scale="md"
                    variant="danger"
                  >
                    I understand
                  </Button>
                </Box>
              </Message>
            ) : (
              <Flex justifyContent="space-between" width="100%" style={{ gap: '8px' }}>
                {QUICK_ACTION_CONFIGS[feeAmount!] &&
                  Object.entries<ZoomLevels>(QUICK_ACTION_CONFIGS[feeAmount!])
                    ?.sort(([a], [b]) => +a - +b)
                    .map(([quickAction, zoomLevel]) => {
                      return (
                        <Button
                          width="100%"
                          key={`quickActions${quickAction}`}
                          onClick={() => {
                            if (+quickAction === activeQuickAction) {
                              handleRefresh(ZOOM_LEVELS[feeAmount!])
                              return
                            }
                            handleRefresh(zoomLevel)

                            setActiveQuickAction(+quickAction)
                            isQuickButtonUsed.current = true
                          }}
                          variant={+quickAction === activeQuickAction ? 'primary' : 'secondary'}
                          scale="sm"
                        >
                          {quickAction}%
                        </Button>
                      )
                    })}
                <Button
                  width="200%"
                  onClick={() => {
                    if (activeQuickAction === 100) {
                      handleRefresh()
                      return
                    }
                    setShowCapitalEfficiencyWarning(true)
                    setActiveQuickAction(100)
                    isQuickButtonUsed.current = true
                  }}
                  variant={activeQuickAction === 100 ? 'primary' : 'secondary'}
                  scale="sm"
                >
                  Full Range
                </Button>
              </Flex>
            )}

            {outOfRange ? (
              <Message variant="warning">
                <RowBetween>
                  <Text ml="12px" fontSize="12px">
                    Your position will not earn fees or be used in trades until the market price moves into your range.
                  </Text>
                </RowBetween>
              </Message>
            ) : null}
            {invalidRange ? (
              <Message variant="warning">
                <MessageText>
                  Invalid range selected. The min price must be lower than the max price.
                </MessageText>
              </Message>
            ) : null}
          </DynamicSection>
          <MediumOnly>{buttons}</MediumOnly>
        </AutoColumn>
      </RightContainer>
    </>
  )
}
