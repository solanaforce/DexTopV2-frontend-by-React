import { Flex, WarningIcon } from 'components'
import { UserMenuItem } from 'widgets/Menu'
import { useAccount, useBalance } from 'wagmi'

interface WalletUserMenuItemProps {
  isWrongNetwork: boolean
  onPresentWalletModal: () => void
}

const WalletUserMenuItem: React.FC<React.PropsWithChildren<WalletUserMenuItemProps>> = ({
  isWrongNetwork,
  onPresentWalletModal,
}) => {
  const { address: account } = useAccount()
  const { data, isFetched } = useBalance({ address: account })
  // const hasLowNativeBalance = isFetched && data && data.value <= LOW_NATIVE_BALANCE

  return (
    <UserMenuItem as="button" onClick={onPresentWalletModal}>
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        Wallet
        {/* {hasLowNativeBalance && !isWrongNetwork && <WarningIcon color="warning" width="24px" />} */}
        {isWrongNetwork && <WarningIcon color="failure" width="24px" />}
      </Flex>
    </UserMenuItem>
  )
}

export default WalletUserMenuItem
