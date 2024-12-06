import { Flex } from 'components/Box'
import { InjectedModalProps, Modal } from 'widgets/Modal'
import { Text, PreTitle } from 'components/Text'
import { ThemeSwitcher } from 'components/ThemeSwitcher'
import { Toggle } from 'components/Toggle'
import { QuestionHelper } from 'components/QuestionHelper'
import { ExpertModal } from 'components/ExpertModal/ExpertModal'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import {
  useExpertMode,
  useUserExpertModeAcknowledgement,
} from 'utils/user'
import useTheme from 'hooks/useTheme'
import { useCallback, useState} from 'react'
import styled from 'styled-components'
import GasSettings from './GasSettings'
import TransactionSettings from './TransactionSettings'
import { SettingsMode } from './types'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

export const withCustomOnDismiss =
  (Component) =>
  ({
    onDismiss,
    customOnDismiss,
    mode,
    ...props
  }: {
    onDismiss?: () => void
    customOnDismiss: () => void
    mode: SettingsMode
  }) => {
    const handleDismiss = useCallback(() => {
      onDismiss?.()
      if (customOnDismiss) {
        customOnDismiss()
      }
    }, [customOnDismiss, onDismiss])

    return <Component {...props} mode={mode} onDismiss={handleDismiss} />
  }

const SettingsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss, mode }) => {
  const { isDark, setTheme } = useTheme()
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgement()
  const [expertMode, setExpertMode] = useExpertMode()
  const { onChangeRecipient } = useSwapActionHandlers()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        toggleExpertMode={() => setExpertMode((s) => !s)}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode || !showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      setExpertMode((s) => !s)
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  return (
    <Modal title='Settings' headerBackground="gradientCardHeader" onDismiss={onDismiss} minWidth={["100%", "100%", "418px"]}>
      <ScrollableContainer>
        {mode === SettingsMode.GLOBAL && (
          <>
            <Flex pb="24px" flexDirection="column">
              <PreTitle mb="24px">Global</PreTitle>
              <Flex justifyContent="space-between" mb="24px">
                <Text>Dark mode</Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
              </Flex>
              <GasSettings />
            </Flex>
          </>
        )}
        {mode === SettingsMode.SWAP_LIQUIDITY && (
          <>
            <Flex pt="3px" flexDirection="column">
              <TransactionSettings />
            </Flex>
          </>
        )}
        {mode === SettingsMode.DEXTOP && (
          <>
            <Flex pt="3px" flexDirection="column">
              <TransactionSettings />
            </Flex>
            <Flex pb="16px" flexDirection="column">
              <Flex justifyContent="space-between">
                <Text fontSize="14px">Dark mode</Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
              </Flex>
              {/* <GasSettings /> */}
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text small>Expert Mode</Text>
                <QuestionHelper
                  text='Bypasses confirmation modals and allows high slippage trades. Use at your own risk.'
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-expert-mode-button"
                scale="md"
                checked={expertMode}
                onChange={handleExpertModeToggle}
              />
            </Flex>
          </>
        )}
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
