import {
  Box,
  Button,
  Flex,
  LinkExternal,
  Message,
  Skeleton,
  Text,
  CopyAddress,
} from 'components'
import { InjectedModalProps } from 'widgets/Modal'
import { WNATIVE } from 'libraries/swap-sdk'
import { ChainId } from 'config/chains'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { formatBigInt, getFullDisplayBalance } from 'utils/formatBalance'
import useAuth from 'hooks/useAuth'
import { ChainLogo } from 'components/Logo/ChainLogo'
import NextLink from 'next/link'

// import { useProfile } from 'state/profile/hooks'

import { getBlockExploreLink, getBlockExploreName } from 'utils'
// import { formatBigNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useBalance } from 'wagmi'

// const COLORS = {
//   ETH: '#627EEA',
//   BNB: '#14151A',
// }

interface WalletInfoProps {
  hasLowNativeBalance: boolean
  switchView: (newIndex: number) => void
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowNativeBalance, onDismiss }) => {
  const { account, chainId, chain } = useActiveWeb3React()
  // const isBSC = chainId === ChainId.ETHEREUM
  // const bnbBalance = useBalance({ address: account, chainId: ChainId.BSC })
  const nativeBalance = useBalance({ address: account ?? undefined, query: { enabled: true } })
  const native = useNativeCurrency()
  // const wNativeToken = WNATIVE[chainId]
  // const wBNBToken = WNATIVE[ChainId.ETHEREUM]
  // const { balance: wNativeBalance, fetchStatus: wNativeFetchStatus } = useTokenBalance(wNativeToken?.address)
  // const { balance: wBNBBalance, fetchStatus: wBNBFetchStatus } = useTokenBalance(wBNBToken?.address, true)
  // const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useGetCakeBalance()
  const accountEllipsis = account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : null;
  const { logout } = useAuth()

  // const { isInitialized, isLoading, profile } = useProfile()
  // const hasProfile = isInitialized && !!profile

  const handleLogout = () => {
    onDismiss?.()
    logout()
  }

  return (
    <>
      {/* <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px"> */}
      <Box mb="8px">
        <Flex justifyContent="space-between" alignItems="center" mb="8px">
          <Text color="secondary" fontSize="14px" fontWeight="bold">
            Connected with {accountEllipsis}
          </Text>
          <CopyAddress tooltipMessage='Copied' account={account ?? undefined} />
        </Flex>
      </Box>
      {chain && <Box mb="8px">
        <Flex justifyContent="space-between" alignItems="center" mb="8px">
          <Flex borderRadius="16px" pl="4px" pr="8px" py="2px">
              <ChainLogo chainId={chain.id} />
              <Text color="primary" ml="4px">
                {chain.name}
              </Text>
          </Flex>
          <LinkExternal href={getBlockExploreLink(account, 'address', chainId)}>
            {getBlockExploreName(chainId)}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="primary">{native.symbol} Balance</Text>
          {!nativeBalance.isFetched ? (
            <Skeleton height="22px" width="60px" />
          ) : (
            <Text>{formatBigInt(nativeBalance?.data?.value ?? 0n, 6)}</Text>
          )}
        </Flex>
      </Box>}
      <Button variant="secondary" width="100%" minHeight={48} onClick={handleLogout} my="12px">
        Disconnect Wallet
      </Button>
    </>
  )
}

export default WalletInfo
