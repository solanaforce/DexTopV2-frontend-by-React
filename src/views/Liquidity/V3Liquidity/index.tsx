import { useMemo, useState } from 'react'
import { Text, Flex, Button, NextLinkFromReactRouter, Tag, Checkbox, Box} from 'components'
import { useAccount } from 'wagmi'
import Dots from 'components/Loader/Dots'
import { AppBody } from 'components/App'
import Page from 'components/Layout/Page'
import { RangeTag } from 'components/RangeTag'
import CurrencyInputHeader from 'views/Swap/components/CurrencyInputHeader'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { PositionDetails } from 'libraries/farms'
import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import PositionListItem from './components/PoolListItem'
import { LiquidityCardRow } from './components/LiquidityCardRow'

const hideClosePositionAtom = atomWithStorageWithErrorCatch('pcs:hide-close-position', false)

function useHideClosePosition() {
  return useAtom(hideClosePositionAtom)
}

enum FILTER {
  ALL = 0,
  V3 = 1,
}

export default function V3Pool() {
  const { address: account } = useAccount()

  // fetch the user's balances of all tracked V2 LP tokens
	const [selectedTypeIndex, setSelectedTypeIndex] = useState(FILTER.ALL)
  const [hideClosedPositions, setHideClosedPositions] = useHideClosePosition()
  const { positions, loading: v3Loading } = useV3Positions(account)
  let v3PairsSection: any = null

  if (positions?.length) {
    const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
      (acc, p) => {
        acc[p.liquidity === 0n ? 1 : 0].push(p)
        return acc
      },
      [[], []],
    ) ?? [[], []]

    const filteredPositions = [...openPositions, ...(hideClosedPositions ? [] : closedPositions)]

    v3PairsSection = filteredPositions.map((p) => {
      return (
        <PositionListItem key={p.tokenId.toString()} positionDetails={p}>
          {({
            currencyBase,
            currencyQuote,
            removed,
            outOfRange,
            feeAmount,
            positionSummaryLink,
            subtitle,
            setInverted,
          }) => {
            let token0Symbol = ''
            let token1Symbol = ''
            if (currencyQuote && currencyBase) {
              token0Symbol =
                currencyQuote.symbol.length > 7 ? currencyQuote.symbol.slice(0, 7).concat('...') : currencyQuote.symbol
              token1Symbol =
                currencyBase.symbol.length > 7 ? currencyBase.symbol.slice(0, 7).concat('...') : currencyBase.symbol
            } else {
							return <></>
						}

            return (
              <LiquidityCardRow
                feeAmount={feeAmount}
                link={positionSummaryLink}
                currency0={currencyQuote}
                currency1={currencyBase}
                tokenId={p.tokenId}
                pairText={
                  !token0Symbol || !token1Symbol ? <Dots>Loading</Dots> : `${token0Symbol}-${token1Symbol} LP`
                }
                tags={
                  <>
                    {p.isStaked && (
                      <Tag outline variant="warning" mr="8px">
                        Farming
                      </Tag>
                    )}
                    <RangeTag removed={removed} outOfRange={outOfRange} />
                  </>
                }
                subtitle={subtitle}
                onSwitch={() => setInverted((prev) => !prev)}
              />
            )
          }}
        </PositionListItem>
      )
    })
  }
  const mainSection = useMemo(() => {
    let resultSection : any = null

    if (!account) {
      return (
        <Flex minHeight="400px" alignItems="center" justifyContent="center">
          <Text color="textSubtle" textAlign="center">
            Connect to a wallet to view your liquidity.
          </Text>
        </Flex>
      )
    }

    if (v3Loading) {
      resultSection = (
        <Flex minHeight="400px" alignItems="center" justifyContent="center">
          <Text color="textSubtle" textAlign="center">
            <Dots>Loading</Dots>
          </Text>
        </Flex>
      )
    } else if (!v3PairsSection) {
      resultSection = (
        <Flex minHeight="400px" alignItems="center" justifyContent="center">
          <Text color="textSubtle" textAlign="center">
            No liquidity found.
          </Text>
        </Flex>
      )
    } else {
      // Order should be v3, stable, v2
      const sections = [v3PairsSection]

      resultSection = (
        <Box mt="12px">
          {selectedTypeIndex ? sections.filter((_, index) => selectedTypeIndex === index + 1) : sections}
        </Box>
      )
    }

    return resultSection
  }, [selectedTypeIndex, v3Loading, v3PairsSection])

  return (
    <Page>
      <Flex justifyContent="center" mt="40px">
        <AppBody>
          <CurrencyInputHeader
            title='Pool'
          />
					{v3PairsSection && v3PairsSection.length > 0 && <Flex as="label" htmlFor="hide-close-positions" alignItems="center">
						<Checkbox
							id="hide-close-positions"
							scale="sm"
							name="confirmed"
							type="checkbox"
							checked={hideClosedPositions}
							onChange={() => setHideClosedPositions((prev) => !prev)}
						/>
						<Text ml="8px" color="textSubtle" fontSize="14px">
							Hide closed positions
						</Text>
					</Flex>}
          {mainSection}
					<Flex justifyContent="space-between" mt="8px"> 
            <Button 
							as={NextLinkFromReactRouter}
							to='/pool/v2' 
							width="49%" 
							// startIcon={<AddIcon color="text" />}
							height="48px"
							variant='text'
						>
							V2 Liquidity
						</Button>
						<Button 
							as={NextLinkFromReactRouter}
							to='/add' 
							width="50%" 
							// startIcon={<AddIcon color="text" />}
							height="48px"
							variant='primary'
						>
							Add Liquidity
						</Button>
					</Flex>
        </AppBody>
      </Flex>
    </Page>
  )
}
