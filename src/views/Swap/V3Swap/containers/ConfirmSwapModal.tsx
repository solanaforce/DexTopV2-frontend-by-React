import { useCallback, memo, useMemo } from 'react'
import { Currency, TradeType, CurrencyAmount } from 'libraries/swap-sdk'
import { InjectedModalProps, Modal } from 'widgets/Modal'
import { ConfirmationPendingContent } from 'widgets/ConfirmationPendingContent'
import { SmartRouterTrade } from 'libraries/smart-router/evm'
import { formatAmount } from 'utils/formatFractions'
import { TransactionSubmittedContent } from 'components/TransactionConfirmationModal'
import { Field } from 'state/swap/actions'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useUserSlippage } from 'utils/user'
import { useSwapState } from 'state/swap/hooks'
import { TransactionErrorContent } from '../../components/TransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components/TransactionConfirmSwapContent'

interface ConfirmSwapModalProps {
  trade?: SmartRouterTrade<TradeType>
  originalTrade?: SmartRouterTrade<TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  onAcceptChanges: () => void
  onConfirm: () => void
  swapErrorMessage?: string
  customOnDismiss?: () => void
  openSettingModal?: () => void
}

export const ConfirmSwapModal = memo<InjectedModalProps & ConfirmSwapModalProps>(function ConfirmSwapModalComp({
  trade,
  originalTrade,
  currencyBalances,
  onAcceptChanges,
  onConfirm,
  onDismiss,
  customOnDismiss,
  swapErrorMessage,
  attemptingTxn,
  txHash,
  openSettingModal,
}) {
  const { chainId } = useActiveChainId()
  const [allowedSlippage] = useUserSlippage()
  const { recipient } = useSwapState()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const confirmationContent =
    !attemptingTxn && !txHash ? (
      swapErrorMessage ? (
        <TransactionErrorContent
          onDismiss={onDismiss}
          message={swapErrorMessage}
        />
      ) : (
        <TransactionConfirmSwapContent
        trade={trade}
        currencyBalances={currencyBalances}
        originalTrade={originalTrade}
        onAcceptChanges={onAcceptChanges}
        allowedSlippage={allowedSlippage}
        onConfirm={onConfirm}
        recipient={recipient ?? undefined}
        />
      )
    ) : null

  // text to show while loading
  const pendingText = useMemo(() => {
    return `Swapping ${formatAmount(trade?.inputAmount, 6) ?? ''} ${trade?.inputAmount?.currency?.symbol ?? ''} for ${formatAmount(trade?.outputAmount, 6) ?? ''} ${trade?.outputAmount?.currency?.symbol ?? ''}`
  }, [trade])

  if (!chainId) return null

  return (
    <Modal title="Review Swap" onDismiss={handleDismiss} bodyPadding='20px' minWidth={["100%", "418px"]}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : txHash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={txHash}
          // onDismiss={handleDismiss}
          // currencyToAdd={trade?.outputAmount.currency}
        />
      ) : null}
      {confirmationContent}
    </Modal>
  )
})
