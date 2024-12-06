import styled from 'styled-components'
import { Button, Text, Link, HelpIcon, Message, MessageText } from 'components'
import { ChainId } from 'config/chains'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

const StyledLink = styled(Link)`
  width: 100%;
  &:hover {
    text-decoration: initial;
  }
`

interface WalletWrongNetworkProps {
  onDismiss: (() => void) | undefined
}

const WalletWrongNetwork: React.FC<React.PropsWithChildren<WalletWrongNetworkProps>> = ({ onDismiss }) => {
  const { switchNetworkAsync, canSwitch } = useSwitchNetwork()

  const handleSwitchNetwork = async (): Promise<void> => {
    await switchNetworkAsync(ChainId.ETHEREUM)
    onDismiss?.()
  }

  return (
    <>
      <Text mb="24px">You’re connected to the wrong network.</Text>
      {canSwitch ? (
        <Button onClick={handleSwitchNetwork} mb="24px">
          Switch Network
        </Button>
      ) : (
        <Message variant="danger">
          <MessageText>Unable to switch network. Please try it on your wallet</MessageText>
        </Message>
      )}
    </>
  )
}

export default WalletWrongNetwork
