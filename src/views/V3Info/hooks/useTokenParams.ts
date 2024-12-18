import { useRouter } from 'next/router'

export function useTokenIdParams(): {
  tokenAddress: string | undefined
} {
  const router = useRouter()

  const tokenAddress = router.isReady
    ? router.query.address as string || undefined
    : undefined

  return { tokenAddress }
}