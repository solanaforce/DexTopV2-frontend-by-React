import styled from 'styled-components'
import { Card } from '../Card'

export const BodyWrapper = styled(Card)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 8px;
  border: 3px solid ${({ theme }) => theme.colors.textDisabled};
  max-width: 464px;
  width: 100%;
  z-index: 1;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper padding="12px">{children}</BodyWrapper>
}
