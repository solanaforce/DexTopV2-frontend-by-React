import { parseUnits } from 'viem'
import {
  ButtonMenu,
  ButtonMenuItem,
  CloseIcon,
  Heading,
  IconButton
} from 'components'
import {
  InjectedModalProps,
  ModalBody,
  ModalContainer,
  ModalHeader as UIKitModalHeader,
  ModalTitle,
} from 'widgets/Modal'
import { useAccount, useBalance } from 'wagmi'
import { useState, useCallback } from 'react'
import styled from 'styled-components'
import WalletInfo from './WalletInfo'
import WalletTransactions from './WalletTransactions'
import WalletWrongNetwork from './WalletWrongNetwork'

export enum WalletView {
  WALLET_INFO,
  TRANSACTIONS,
  WRONG_NETWORK,
}

interface WalletModalProps extends InjectedModalProps {
  initialView?: WalletView
}

// export const LOW_NATIVE_BALANCE = parseUnits('0.002', 'ether')

const ModalHeader = styled(UIKitModalHeader)`
  // background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const Tabs = styled.div`
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 16px 24px;
`

const Region = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 8px;
  padding: 12px 12px 0px 12px;
  margin-bottom: 16px;
`

interface TabsComponentProps {
  view: WalletView
  handleClick: (newIndex: number) => void
}

const WalletModal: React.FC<React.PropsWithChildren<WalletModalProps>> = ({
  initialView = WalletView.WALLET_INFO,
  onDismiss,
}) => {
  const [view, setView] = useState(initialView)
  const { address: account } = useAccount()
  const { data, isFetched } = useBalance({ address: account })
  // const hasLowNativeBalance = isFetched && data && data.value.lte(LOW_NATIVE_BALANCE)

  const handleClick = useCallback((newIndex: number) => {
    setView(newIndex)
  }, [])

  return (
    <ModalContainer title='Welcome!'>
      <ModalHeader>
        <ModalTitle>
          <Heading>Wallet</Heading>
        </ModalTitle>
        <IconButton scale="sm" variant="text" onClick={onDismiss}>
          <CloseIcon width="20px" color="text" />
        </IconButton>
      </ModalHeader>
      {/* {view !== WalletView.WRONG_NETWORK && <TabsComponent view={view} handleClick={handleClick} />} */}
      {/* <ModalBody p="24px" width="100%"> */}
      <ModalBody p="8px" width="100%">
        {view === WalletView.WALLET_INFO && (
          <>
            <Region>
              <WalletInfo hasLowNativeBalance={false} switchView={handleClick} onDismiss={onDismiss} />
            </Region>
            <Region>
              <WalletTransactions onDismiss={onDismiss} />
            </Region>
          </>
        )}
        {/* {view === WalletView.TRANSACTIONS && <WalletTransactions onDismiss={onDismiss} />} */}
        {view === WalletView.WRONG_NETWORK && <WalletWrongNetwork onDismiss={onDismiss} />}
      </ModalBody>
    </ModalContainer>
  )
}

export default WalletModal
