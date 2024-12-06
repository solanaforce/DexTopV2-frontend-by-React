import styled from 'styled-components'
import { Box, Button, Flex, Text } from 'components'
import { useAppDispatch } from 'state'
import { useAllSortedRecentTransactions } from 'state/transactions/hooks'
import { clearAllTransactions } from 'state/transactions/actions'
import isEmpty from 'lodash/isEmpty'
import { chains } from 'utils/wagmi'
import TransactionRow from './TransactionRow'

const TransactionsContainer = styled(Box)`
  max-height: 300px;
  overflow-y: auto;
`

interface WalletTransactionsProps {
  onDismiss: (() => void) | undefined
}

const WalletTransactions: React.FC<React.PropsWithChildren<WalletTransactionsProps>> = ({ onDismiss }) => {
  const dispatch = useAppDispatch()
  const sortedTransactions = useAllSortedRecentTransactions()

  const hasTransactions = !isEmpty(sortedTransactions)

  const handleClearAll = () => {
    dispatch(clearAllTransactions())
  }

  return (
    <Box minHeight="120px">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold">
          Recent Transactions
        </Text>
        {hasTransactions && (
          <Button scale="sm" onClick={handleClearAll} variant="text" px="0">
            Clear all
          </Button>
        )}
      </Flex>
      {hasTransactions ? (
        <TransactionsContainer>
          {Object.entries(sortedTransactions).map(([chainId, transactions]) => {
            const chainIdNumber = Number(chainId)
            return (
              <Box key={chainId}>
                <Text fontSize="12px" color="textSubtle" mb="4px">
                  {chains.find((c) => c.id === chainIdNumber)?.name ?? 'Unknown network'}
                </Text>
                {Object.values(transactions).map((txn) => (
                  <TransactionRow
                    key={txn.hash}
                    txn={txn}
                    chainId={chainIdNumber}
                    type={txn.type}
                    onDismiss={onDismiss}
                  />
                ))}
              </Box>
            )
          })}
        </TransactionsContainer>
      ) : (
        <Text textAlign="center">No recent transactions</Text>
      )}
    </Box>
  )
}

export default WalletTransactions
