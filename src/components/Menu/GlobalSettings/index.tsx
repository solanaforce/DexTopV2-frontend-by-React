// import { ButtonProps, CogIcon, Flex, IconButton, useModal } from ''
import { ButtonProps, IconButton } from 'components/Button'
import { Flex } from 'components/Box'
import { CogIcon } from 'components/Svg'
import { useModal } from 'widgets/Modal'
import styled from 'styled-components'
import SettingsModal from './SettingsModal'

const StyledFlex = styled(Flex)`
  margin-left: 4px;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  border 1px solid ${({ theme }) => theme.colors.textDisabled};
  background: ${({ theme }) => theme.colors.background};
  justify-content: center;
  align-items: center;
`

type Props = {
  color?: string
  mr?: string
  mode?: string
} & ButtonProps

const GlobalSettings = ({ color, mr = '8px', mode, ...rest }: Props) => {
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={mode} />)

  return (
    <StyledFlex>
      <IconButton
        onClick={onPresentSettingsModal}
        variant="text"
        // mr={mr}
        id={`open-settings-dialog-button-${mode}`}
        {...rest}
      >
        <CogIcon height={24} width={24} color={color || 'textSubtle'} />
      </IconButton>
    </StyledFlex>
  )
}

export default GlobalSettings
