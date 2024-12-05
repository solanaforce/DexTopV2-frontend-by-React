// eslint-disable-next-line no-restricted-imports
import { TradeType } from 'libraries/swap-sdk'
import { SmartRouterTrade } from 'libraries/smart-router/evm'
import { FeeOptions } from 'libraries/v3-sdk'
import { ReactNode, useMemo } from 'react'

import { useUserSlippage } from 'utils/user'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { useSwapState } from 'state/swap/hooks'
import { basisPointsToPercent } from 'utils/exchange'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { Address } from 'viem'
import useSendSwapTransaction from './useSendSwapTransaction'
import { useSwapCallArguments } from './useSwapCallArguments'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface UseSwapCallbackReturns {
  state: SwapCallbackState
  callback?: () => Promise<{ hash: Address }>
  error?: ReactNode
}
interface UseSwapCallbackArgs {
  trade: SmartRouterTrade<TradeType> | undefined | null // trade to execute, required
  // allowedSlippage: Percent // in bips
  // recipientAddressOrName: string | null | undefined // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  // signatureData: SignatureData | null | undefined
  deadline?: bigint
  feeOptions?: FeeOptions
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback({
  trade,
  // signatureData,
  deadline,
  feeOptions,
}: UseSwapCallbackArgs): UseSwapCallbackReturns {
  const { account, chainId } = useAccountActiveChain()
  const [allowedSlippageRaw] = useUserSlippage() || [INITIAL_ALLOWED_SLIPPAGE]
  const allowedSlippage = useMemo(() => basisPointsToPercent(allowedSlippageRaw), [allowedSlippageRaw])
  const { recipient: recipientAddress } = useSwapState()
  const recipient = recipientAddress === null ? account : recipientAddress

  const swapCalls = useSwapCallArguments(
    trade,
    allowedSlippage,
    recipientAddress,
    // signatureData,
    deadline,
    feeOptions,
  )
  const { callback } = useSendSwapTransaction(account, chainId, trade ?? undefined, swapCalls)

  return useMemo(() => {
    if (!trade || !account || !chainId || !callback) {
      return { state: SwapCallbackState.INVALID, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddress !== null) {
        return { state: SwapCallbackState.INVALID, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING }
    }

    return {
      state: SwapCallbackState.VALID,
      callback,
    }
  }, [trade, account, chainId, callback, recipient, recipientAddress])
}
