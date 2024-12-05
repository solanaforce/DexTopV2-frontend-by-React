import { QuestionHelper, Tag, TagProps, Flex } from 'components'
import { ReactNode } from 'react'

export function RangeTag({
  removed,
  outOfRange,
  children,
  ...props
}: { removed?: boolean; outOfRange: boolean; children?: ReactNode } & TagProps) {
  return removed ? (
    <Tag variant="textSubtle" {...props}>
      {children || 'Closed'}
    </Tag>
  ) : outOfRange ? (
    <Tag variant="failure" {...props}>
      {children || (
        <Flex alignItems="center">
          {'Inactive'}{' '}
          <QuestionHelper
            position="relative"
            top="1px"
            ml="4px"
            text='The position is inactive and not earning trading fees due to the current price being out of the set price range.'
            size="20px"
            color="white"
            placement="bottom"
          />
        </Flex>
      )}
    </Tag>
  ) : (
    <Tag variant="success" {...props}>
      {children || 'Active'}
    </Tag>
  )
}
