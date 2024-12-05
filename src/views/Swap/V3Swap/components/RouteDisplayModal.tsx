import { Route, SmartRouter } from 'libraries/smart-router/evm'
import {
  QuestionHelper,
  Text,
  Flex,
  Box,
} from 'components'
import { UseModalV2Props, Modal, ModalV2 } from 'widgets/Modal'
import { useTooltip } from 'hooks'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { Currency } from 'libraries/swap-sdk'
import { AtomBox } from 'components/AtomBox'
import { useMemo, memo } from 'react'
import styled from 'styled-components'
import { v3FeeToPercent } from '../utils/exchange'

const RouterBox = styled(Flex)`
  position: relative;
  flex-direction: row;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 3px;
    border-top: 3px dotted ${({ theme }) => theme.colors.backgroundDisabled};
    transform: translateY(-50%);
    z-index: 1;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 400px;
  }
`

const RouterPoolBox = styled(Box)`
  position: relative;
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  padding: 2px 4px;
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  z-index: 2;
  svg,
  img {
    &:first-child {
      margin-bottom: 2px;
      ${({ theme }) => theme.mediaQueries.md} {
        margin-bottom: 0px;
        margin-right: 2px;
      }
    }
  }
  &.isStableSwap,
  &.highlight {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 4px 8px;
  }
`
const RouterTypeText = styled.div<{ fontWeight?: string }>`
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  position: absolute;
  transform: translateY(-50%);
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  top: calc(100% + 3px);
  font-weight: ${(props) => props.fontWeight || 'normal'};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
    line-height: 20px;
  }
`

const CurrencyLogoWrapper = styled(AtomBox)`
  position: relative;
  padding: 2px;
  background: linear-gradient(180deg, #53dee9 0%, #7645d9 76.22%);
  border-radius: 50%;
  z-index: 2;
`

type Pair = [Currency, Currency]

interface Props extends UseModalV2Props {
  routes: Route[]
}

export const RouteDisplayModal = memo(function RouteDisplayModal({ isOpen, onDismiss, routes }: Props) {
  return (
    <ModalV2 closeOnOverlayClick isOpen={isOpen} onDismiss={onDismiss} minHeight="0">
      <Modal
        title={
          <Flex justifyContent="center">
            Route{' '}
            <QuestionHelper
              text='Routing through these tokens resulted in the best price for your trade.'
              ml="4px"
              placement="top-start"
            />
          </Flex>
        }
        style={{ minHeight: '0' }}
        bodyPadding="24px"
      >
        <AutoColumn gap="48px">
          {routes.map((route, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <RouteDisplay key={i} route={route} />
          ))}
        </AutoColumn>
      </Modal>
    </ModalV2>
  )
})

interface RouteDisplayProps {
  route: Route
}

export const RouteDisplay = memo(function RouteDisplay({ route }: RouteDisplayProps) {
  const { path, pools, inputAmount, outputAmount } = route
  const { currency: inputCurrency } = inputAmount
  const { currency: outputCurrency } = outputAmount
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<Text>{inputCurrency.symbol}</Text>, {
    placement: 'right',
  })

  const {
    targetRef: outputTargetRef,
    tooltip: outputTooltip,
    tooltipVisible: outputTooltipVisible,
  } = useTooltip(<Text>{outputCurrency.symbol}</Text>, {
    placement: 'right',
  })

  const pairs = useMemo<Pair[]>(() => {
    if (path.length <= 1) {
      return []
    }

    const currencyPairs: Pair[] = []
    for (let i = 0; i < path.length - 1; i += 1) {
      currencyPairs.push([path[i], path[i + 1]])
    }
    return currencyPairs
  }, [path])

  const pairNodes =
    pairs.length > 0
      ? pairs.map((p, index) => {
          const [input, output] = p
          const pool = pools[index]
          const isV3Pool = SmartRouter.isV3Pool(pool)
          const isV2Pool = SmartRouter.isV2Pool(pool)
          const key = isV2Pool ? `v2_${pool.reserve0.currency.symbol}_${pool.reserve1.currency.symbol}` : pool.address
          const text = isV2Pool
            ? 'V2'
            : isV3Pool
            ? `V3 (${v3FeeToPercent(pool.fee).toSignificant(6)}%)`
            : 'StableSwap'
          const tooltipText = `${input.symbol}/${output.symbol}${
            isV3Pool ? ` (${v3FeeToPercent(pool.fee).toSignificant(6)}%)` : ''
          }`
          return (
            <PairNode pair={p} key={key} text={text} className={isV3Pool ? 'highlight' : ""} tooltipText={tooltipText} />
          )
        })
      : null

  return (
    <AutoColumn gap="24px">
      <RouterBox justifyContent="space-between" alignItems="center">
        <CurrencyLogoWrapper
          size={{
            xs: '32px',
            md: '48px',
          }}
          ref={targetRef}
        >
          <CurrencyLogo size="100%" currency={inputCurrency} />
          <RouterTypeText fontWeight="bold">{route.percent}%</RouterTypeText>
        </CurrencyLogoWrapper>
        {tooltipVisible && tooltip}
        {pairNodes}
        <CurrencyLogoWrapper
          size={{
            xs: '32px',
            md: '48px',
          }}
          ref={outputTargetRef}
        >
          <CurrencyLogo size="100%" currency={outputCurrency} />
        </CurrencyLogoWrapper>
        {outputTooltipVisible && outputTooltip}
      </RouterBox>
    </AutoColumn>
  )
})

function PairNode({
  pair,
  text,
  className,
  tooltipText,
}: {
  pair: Pair
  text: string
  className: string
  tooltipText: string
}) {
  const [input, output] = pair

  const tooltip = useTooltip(tooltipText)

  return (
    <RouterPoolBox className={className} ref={tooltip.targetRef}>
      {tooltip.tooltipVisible && tooltip.tooltip}
      <AtomBox
        size={{
          xs: '24px',
          md: '32px',
        }}
      >
        <CurrencyLogo size="100%" currency={input} />
      </AtomBox>
      <AtomBox
        size={{
          xs: '24px',
          md: '32px',
        }}
      >
        <CurrencyLogo size="100%" currency={output} />
      </AtomBox>
      <RouterTypeText>{text}</RouterTypeText>
    </RouterPoolBox>
  )
}
