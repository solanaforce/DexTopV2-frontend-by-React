import { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Button, NextLinkFromReactRouter, OpenNewIcon, Box} from 'components'
import { useAccount } from 'wagmi'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { usePairs, PairState } from 'hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import Dots from 'components/Loader/Dots'
import { AppHeader, AppBody } from 'components/App'
import Page from 'components/Layout/Page'
import CurrencyInputHeader from 'views/Swap/components/CurrencyInputHeader'

const Body = styled.div`
  border: 1px solid ${({theme}) => theme.colors.input};
	border-radius: 8px;
`

export default function Pool() {
  const { address: account } = useAccount()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // const stablePairs = useLPTokensWithBalanceByAccount(account)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Flex minHeight="400px" alignItems="center" justifyContent="center">
          <Text color="textSubtle" textAlign="center">
            Connect to a wallet to view your liquidity.
          </Text>
        </Flex>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>Loading</Dots>
        </Text>
      )
    }

    let positionCards : any[] = []

    if (allV2PairsWithLiquidity?.length > 0) {
      positionCards = allV2PairsWithLiquidity.map((v2Pair, index) => (
        v2Pair ? <Body
          key={`liquidity-${v2Pair.liquidityToken.address}`}
        >
					<FullPositionCard
						pair={v2Pair}
						mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
					/>
				</Body> : <></>
      ))
    }

    if (positionCards?.length > 0) {
      return positionCards
    }

    return (
      <Flex minHeight="400px" alignItems="center" justifyContent="center">
        <Text color="textSubtle" textAlign="center">
          No liquidity found.
        </Text>
      </Flex>
    )
  }

  return (
    <Page>
      <Flex justifyContent="center" mt="40px">
        <AppBody>
          <AppHeader title='V2 Liquidity' backTo="/pool" />
          {renderBody()}
					<Flex justifyContent="space-between" mt="20px"> 
						<Button 
							as={NextLinkFromReactRouter}
							to='/find'
							width="44%" 
							height="48px"
							variant='secondary'
						>
							Import Pool
						</Button>
						<Button 
							as={NextLinkFromReactRouter}
							to='/add/v2' 
							width="55%" 
							// startIcon={<AddIcon color="text" />}
							height="48px"
							variant='primary'
						>
							Add V2 Liquidity
						</Button>
					</Flex>
        </AppBody>
      </Flex>
    </Page>
  )
}
