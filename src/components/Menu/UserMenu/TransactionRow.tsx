import { BlockIcon, BscScanIcon, CheckmarkCircleIcon, Flex, RefreshIcon } from 'components'
import { useAppDispatch } from 'state'
import { TransactionType } from 'state/transactions/actions'
import { TransactionDetails } from 'state/transactions/reducer'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'

interface TransactionRowProps {
  txn: TransactionDetails
  chainId: number
  type?: TransactionType
  onDismiss: (() => void) | undefined
}

const TxnIcon = styled(Flex)`
  align-items: center;
  flex: none;
  width: 24px;
`

const Summary = styled.div`
  flex: 1;
  padding: 0 8px;
  font-size: 14px;
`

const TxnLink = styled.div`
  cursor: pointer;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  margin-bottom: 16px;
  width: 100%;

  &:hover {
    text-decoration: none;
  }
`

const renderIcon = (txn: TransactionDetails) => {
  const { receipt } = txn
  if (!txn.receipt) {
    return <RefreshIcon spin width="24px" />
  }

  return receipt?.status === 1 || typeof receipt?.status === 'undefined' ? (
    <CheckmarkCircleIcon color="success" width="24px" />
  ) : (
    <BlockIcon color="failure" width="24px" />
  )
}

const TransactionRow: React.FC<React.PropsWithChildren<TransactionRowProps>> = ({ txn, chainId, type, onDismiss }) => {
  const dispatch = useAppDispatch()

  const onClickTransaction = () => {
    const url = getBlockExploreLink(txn.hash, 'transaction', chainId)
    window.open(url, '_blank', 'noopener noreferrer')
  }

  if (!txn) {
    return null
  }

  console.log(txn.translatableSummary)

  return (
    <TxnLink onClick={onClickTransaction}>
      <TxnIcon>{renderIcon(txn)}</TxnIcon>
      <Summary>
        {txn.summary}
        {/* {txn.translatableSummary
          ? txn.translatableSummary.text
          : txn.summary ?? txn.hash} */}
      </Summary>
      <TxnIcon>
        <BscScanIcon width="24px" color="primary" />
      </TxnIcon>
    </TxnLink>
  )
}

export default TransactionRow
