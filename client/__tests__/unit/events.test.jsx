import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Events from '../../src/components/Events.jsx'

const mockEvents = [
  { id: 1, title: 'Yoga Class', event_date: '2025-01-01', location: 'London' },
  { id: 2, title: 'Chess Club', event_date: '2025-02-01', location: 'Manchester' }
]

describe('Events component', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  test('shows no upcoming events when list is empty', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => [] })
    render(<Events userEventEmail="john@test.com" />)
    await waitFor(() => {
      expect(screen.getByText(/no upcoming events/i)).toBeInTheDocument()
    })
  })

  test('renders list of events', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockEvents })
    render(<Events userEventEmail="john@test.com" />)
    await waitFor(() => {
      expect(screen.getByText(/yoga class/i)).toBeInTheDocument()
      expect(screen.getByText(/chess club/i)).toBeInTheDocument()
    })
  })

  test('renders event date and location', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockEvents })
    render(<Events userEventEmail="john@test.com" />)
    await waitFor(() => {
      expect(screen.getByText(/london/i)).toBeInTheDocument()
      expect(screen.getByText(/manchester/i)).toBeInTheDocument()
    })
  })

  test('renders leave group button for each event', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => mockEvents })
    render(<Events userEventEmail="john@test.com" />)
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /leave group/i })).toHaveLength(2)
    })
  })

  test('removes event from list after leaving', async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => mockEvents })
      .mockResolvedValueOnce({ json: async () => ({ success: true }) })
    render(<Events userEventEmail="john@test.com" />)
    await waitFor(() => screen.getByText(/yoga class/i))
    fireEvent.click(screen.getAllByRole('button', { name: /leave group/i })[0])
    await waitFor(() => {
      expect(screen.queryByText(/yoga class/i)).not.toBeInTheDocument()
    })
  })

  test('renders your events heading', async () => {
    global.fetch.mockResolvedValueOnce({ json: async () => [] })
    render(<Events userEventEmail="john@test.com" />)
    await waitFor(() => {
      expect(screen.getByText(/your events/i)).toBeInTheDocument()
    })
  })
})