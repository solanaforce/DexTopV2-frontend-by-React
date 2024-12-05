import { Box, AutoRow, Button, ChevronDownIcon } from 'components'
import { Dispatch, ReactElement, SetStateAction } from 'react'
import styled from 'styled-components'

const LightGreyCard = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1.25rem'};
  border: 1px solid ${({ theme }) => theme.colors.backgroundAlt};
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: ${({ borderRadius }) => borderRadius ?? '8px'};
`

interface HideShowSelectorSectionPropsType {
  noHideButton?: boolean
  showOptions: boolean
  setShowOptions: Dispatch<SetStateAction<boolean>>
  heading: ReactElement
  content: ReactElement
}

export default function HideShowSelectorSection({
  noHideButton,
  showOptions,
  setShowOptions,
  heading,
  content,
}: HideShowSelectorSectionPropsType) {
  return (
    <LightGreyCard padding="8px" style={{ height: 'fit-content' }}>
      <AutoRow justifyContent="space-between" marginBottom={showOptions ? '8px' : '0px'}>
        {heading ?? <div />}
        {noHideButton || (
          <Button
            scale="sm"
            onClick={() => setShowOptions((prev) => !prev)}
            variant="text"
            endIcon={
              !showOptions && (
                <ChevronDownIcon
                  style={{
                    marginLeft: '0px',
                  }}
                  color="primary"
                />
              )
            }
          >
            {showOptions ? 'Hide' : 'More'}
          </Button>
        )}
      </AutoRow>
      {showOptions && content}
    </LightGreyCard>
  )
}
