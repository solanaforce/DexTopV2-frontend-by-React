import { useRouter } from 'next/router'

export function useTokenIdParams(): {
  tokenId: string | undefined
} {
  const router = useRouter()

  const tokenId = router.isReady
    ? router.query.tokenId as string || undefined
    : undefined

  return { tokenId }
}
