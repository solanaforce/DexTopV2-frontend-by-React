import { ChainId } from 'config/chains'
import { Box, Flex } from 'components/Box'
import { LogoutIcon, RefreshIcon } from 'components/Svg'
import { useModal } from 'widgets/Modal'
import { UserMenu as UIKitUserMenu, UserMenuDivider, UserMenuItem, UserMenuVariant } from 'widgets/Menu'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import NextLink from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { usePendingTransactions } from 'state/transactions/hooks'
import { useAccount } from 'wagmi'
import WalletModal, { WalletView } from './WalletModal'
import WalletUserMenuItem from './WalletUserMenuItem'

const UserMenuItems = () => {
  // const { t } = useTranslation()
  const { chainId, isWrongNetwork } = useActiveChainId()
  // const { logout } = useAuth()
  const { address: account } = useAccount()
  const { hasPendingTransactions } = usePendingTransactions()
  // const { isInitialized, isLoading, profile } = useProfile()
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)
  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)
  const [onPresentWrongNetworkModal] = useModal(<WalletModal initialView={WalletView.WRONG_NETWORK} />)

  const onClickWalletMenu = useCallback((): void => {
    if (isWrongNetwork) {
      onPresentWrongNetworkModal()
    } else {
      onPresentWalletModal()
    }
  }, [isWrongNetwork, onPresentWalletModal, onPresentWrongNetworkModal])

  return (
    <>
      <WalletUserMenuItem isWrongNetwork={isWrongNetwork} onPresentWalletModal={onClickWalletMenu} />
      <UserMenuItem as="button" disabled={isWrongNetwork} onClick={onPresentTransactionModal}>
        Recent Transactions
        {hasPendingTransactions && <RefreshIcon spin />}
      </UserMenuItem>
      <UserMenuDivider />
      {/* <NextLink href={`/profile/${account?.toLowerCase()}`} passHref>
        <UserMenuItem disabled={isWrongNetwork || chainId !== ChainId.BSC}>{t('Your NFTs')}</UserMenuItem>
      </NextLink> */}
      <UserMenuDivider />
      {/* <UserMenuItem as="button" onClick={logout}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          Disconnect
          <LogoutIcon />
        </Flex>
      </UserMenuItem> */}
    </>
  )
}

const UserMenu = () => {
  const { address: account } = useAccount()
  const { isWrongNetwork } = useActiveChainId()
  const { hasPendingTransactions, pendingNumber } = usePendingTransactions()
  const [userMenuText, setUserMenuText] = useState<string>('')
  const [userMenuVariable, setUserMenuVariable] = useState<UserMenuVariant>('default')
  const [onPresentWalletModal] = useModal(<WalletModal initialView={WalletView.WALLET_INFO} />)

  useEffect(() => {
    if (hasPendingTransactions) {
      setUserMenuText(`${pendingNumber} Pending`)
      setUserMenuVariable('pending')
    } else {
      setUserMenuText('')
      setUserMenuVariable('default')
    }
  }, [hasPendingTransactions, pendingNumber])

  if (account) {
    return (
      <UIKitUserMenu
        account={account}
        avatarSrc={undefined}
        text={userMenuText}
        variant={userMenuVariable}
        onClick={onPresentWalletModal}
      >
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  if (isWrongNetwork) {
    return (
      <UIKitUserMenu text='Network' variant="danger">
        {({ isOpen }) => (isOpen ? <UserMenuItems /> : null)}
      </UIKitUserMenu>
    )
  }

  return (
    <ConnectWalletButton />
  )
}

export default UserMenu
