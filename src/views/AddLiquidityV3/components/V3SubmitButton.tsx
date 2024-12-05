import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Currency, CurrencyAmount } from 'libraries/swap-sdk'
import { AutoColumn, Button, RowBetween, Text } from 'components'
import Dots from 'components/Loader/Dots'
import { CommitButton } from 'components/CommitButton'
import { ApprovalState } from 'hooks/useApproveCallback'
import { ReactNode } from 'react'
import { Address } from 'viem'
import { Field } from '../formViews/V3FormView/form/actions'

interface V3SubmitButtonProps {
  addIsUnsupported: boolean
  addIsWarning: boolean
  account: string | undefined
  isWrongNetwork: boolean
  approvalA: ApprovalState
  approvalB: ApprovalState
  isValid: boolean
  showApprovalA: boolean
  approveACallback: () => Promise<{ hash: Address } | undefined>
  currencies: {
    CURRENCY_A?: Currency
    CURRENCY_B?: Currency
  }
  approveBCallback: () => Promise<{ hash: Address } | undefined>
  showApprovalB: boolean
  parsedAmounts: {
    CURRENCY_A?: CurrencyAmount<Currency>
    CURRENCY_B?: CurrencyAmount<Currency>
  }
  onClick: () => void | Promise<void>
  attemptingTxn: boolean
  errorMessage: ReactNode
  buttonText: string
  depositADisabled: boolean
  depositBDisabled: boolean
}

export function V3SubmitButton({
  addIsUnsupported,
  addIsWarning,
  account,
  isWrongNetwork,
  approvalA,
  approvalB,
  isValid,
  showApprovalA,
  approveACallback,
  currencies,
  approveBCallback,
  showApprovalB,
  parsedAmounts,
  onClick,
  attemptingTxn,
  errorMessage,
  buttonText,
  depositADisabled,
  depositBDisabled,
}: V3SubmitButtonProps) {
  const { open } = useWeb3Modal()
  let buttons: any = null
  if (addIsUnsupported || addIsWarning) {
    buttons = (
      <Button disabled mb="4px">
        Unsupported Asset
      </Button>
    )
  } else if (!account) {
    buttons = (<Button
    width="100%"
    variant='primary'
    height="58px"
    onClick={() => open()}
  >
    <Text fontSize="20px">
      Connect Wallet
    </Text>
  </Button>)
  } else if (isWrongNetwork) {
    buttons = <CommitButton />
  } else {
    buttons = (
      <AutoColumn gap="md">
        {(approvalA === ApprovalState.NOT_APPROVED ||
          approvalA === ApprovalState.PENDING ||
          approvalB === ApprovalState.NOT_APPROVED ||
          approvalB === ApprovalState.PENDING) &&
          isValid && (
            <RowBetween style={{ gap: '8px' }}>
              {showApprovalA && (
                <Button onClick={approveACallback} disabled={approvalA === ApprovalState.PENDING} width="100%" height="48px" variant='secondary'>
                  {approvalA === ApprovalState.PENDING ? (
                    <Dots>{`Enabling ${currencies[Field.CURRENCY_A]?.symbol}`}</Dots>
                  ) : (
                    `Enable ${currencies[Field.CURRENCY_A]?.symbol}`
                  )}
                </Button>
              )}
              {showApprovalB && (
                <Button onClick={approveBCallback} disabled={approvalB === ApprovalState.PENDING} width="100%" height="48px" variant='secondary'>
                  {approvalB === ApprovalState.PENDING ? (
                    <Dots>{`Enabling ${currencies[Field.CURRENCY_B]?.symbol}`}</Dots>
                  ) : (
                    `Enable ${currencies[Field.CURRENCY_B]?.symbol}`
                  )}
                </Button>
              )}
            </RowBetween>
          )}
        <CommitButton
          variant={
            !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'danger' : 'primary'
          }
          onClick={onClick}
          disabled={
            !isValid ||
            attemptingTxn ||
            (approvalA !== ApprovalState.APPROVED && !depositADisabled) ||
            (approvalB !== ApprovalState.APPROVED && !depositBDisabled)
          }
          height="48px"
        >
          {errorMessage || buttonText}
        </CommitButton>
      </AutoColumn>
    )
  }

  return buttons
}
