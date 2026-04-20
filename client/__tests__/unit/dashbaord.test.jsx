import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Dashboard from '../../src/components/Dashboard.jsx'

vi.mock('../../src/components/BarChart.jsx', () => ({
  default: ({ title }) => <div data-testid="bar-chart">{title}</div>
}))

vi.mock('../../src/components/LineChart.jsx', () => ({
  default: () => <div data-testid="line-chart">Line Chart</div>
}))

const mockDashboardData = {
  activeUsers: 42,
  registrationPercent: 75,
  interests: [
    { name: 'Running', count: 10 },
    { name: 'Gaming', count: 8 }
  ],
  attendance: [
    { name: 'Yoga Class', count: 20 },
    { name: 'Chess Club', count: 15 }
  ],
  ratings: [
    { name: 'Yoga Class', avg_rating: 4.5 },
    { name: 'Chess Club', avg_rating: 4.8 }
  ],
  userGrowth: []
}

describe('Dashboard component', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => mockDashboardData
    })
  })

  test('renders dashboard title', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/dashboard menu/i)).toBeInTheDocument()
    })
  })

  test('shows active users count', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  test('shows registration percent', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  })

  test('renders bar charts after data loads', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getAllByTestId('bar-chart')).toHaveLength(3)
    })
  })

  test('renders line chart', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument()
    })
  })

  test('renders past events section', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/past events/i)).toBeInTheDocument()
    })
  })

  test('shows top interests chart title', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/top interests/i)).toBeInTheDocument()
    })
  })

  test('shows top activities by rating chart title', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/top activities by rating/i)).toBeInTheDocument()
    })
  })

  test('shows top activities by attendance chart title', async () => {
    render(<Dashboard />)
    await waitFor(() => {
      expect(screen.getByText(/top activities by attendance/i)).toBeInTheDocument()
    })
  })
})