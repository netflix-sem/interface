import { useFilterPossiblyMaliciousPositions } from 'hooks/useFilterPossiblyMaliciousPositions'
import { useV3Positions } from 'hooks/useV3Positions'
import Pool from 'pages/LegacyPool'
import { mocked } from 'test-utils/mocked'
import { render, screen } from 'test-utils/render'
import { useEnabledChains, useIsSupportedChainId } from 'uniswap/src/features/chains/hooks'
import { UniverseChainId } from 'uniswap/src/features/chains/types'

jest.mock('uniswap/src/features/chains/hooks', () => ({
  useEnabledChains: jest.fn(),
  useSupportedChainId: jest.fn(),
  useIsSupportedChainId: jest.fn(),
}))
jest.mock('hooks/useV3Positions')
jest.mock('hooks/useFilterPossiblyMaliciousPositions')

describe('networks', () => {
  beforeEach(() => {
    mocked(useEnabledChains).mockReturnValue({
      isTestnetModeEnabled: false,
      chains: [],
      gqlChains: [],
      defaultChainId: UniverseChainId.Mainnet,
    })
    mocked(useIsSupportedChainId).mockReturnValue(true)
  })

  it('renders error card when unsupported chain is selected', async () => {
    mocked(useIsSupportedChainId).mockReturnValue(false)
    mocked(useV3Positions).mockReturnValue({ loading: false, positions: undefined })
    mocked(useFilterPossiblyMaliciousPositions).mockReturnValue([])

    render(<Pool />)
    expect(screen.getByText('Your connected network is unsupported.')).toBeInTheDocument()
  })

  it('renders empty positions card when on supported chain with no positions', async () => {
    mocked(useIsSupportedChainId).mockReturnValue(true)
    mocked(useV3Positions).mockReturnValue({ loading: false, positions: undefined })
    mocked(useFilterPossiblyMaliciousPositions).mockReturnValue([])

    render(<Pool />)
    expect(screen.getByText('Your active V3 liquidity positions will appear here.')).toBeInTheDocument()
  })
})
