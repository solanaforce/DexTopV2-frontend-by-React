import { SubMenuItems } from 'components'
import { useRouter } from 'next/router'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import { v3InfoPath } from '../../constants'
import InfoNav from './InfoNav'

export const InfoPageLayout = ({ children }) => {
  const router = useRouter()
  const chainName = useChainNameByQuery()
  const chainPath = useMultiChainPath()
  const isV3 = router?.pathname?.includes(v3InfoPath)

  return (
    <>
      {/* <SubMenuItems
        items={[
          {
            label: 'V3',
            href: `/info/${chainPath}`,
          },
          {
            label: 'V2',
            href: `/info${chainPath}`,
          },
        ]}
        activeItem={`/info${chainPath}`}
      /> */}
      <InfoNav isStableSwap={false} />
      {children}
    </>
  )
}
