import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Home from '../../src/components/home.jsx'

const defaultProps = {
  name: 'John',
  userEventEmail: 'john@test.com'
}

const mockFetch = (newEvent, nextEvent, pastEvent) => {
  global.fetch = vi.fn()
    .mockResolvedValueOnce({ json: async () => pastEvent })
    .mockResolvedValueOnce({ json: async () => newEvent })
    .mockResolvedValueOnce({ json: async () => nextEvent })
}

describe('Home component', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  test('shows loading state initially', () => {
    global.fetch = vi.fn(() => new Promise(() => {}))
    render(<Home {...defaultProps} />)
    expect(screen.getByText(/page loading/i)).toBeInTheDocument()
  })

  test('shows welcome message with user name', async () => {
    mockFetch(
      { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga', registration_id: 1 },
      { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
      { title: 'Past Event', event_id: 1 }
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByText(/welcome back john/i)).toBeInTheDocument()
    })
  })

  test('shows new event when available', async () => {
    mockFetch(
      { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga', registration_id: 1 },
      { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
      { title: 'Past Event', event_id: 1 }
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByText(/yoga class/i)).toBeInTheDocument()
    })
  })

  test('shows no new events message when none available', async () => {
    mockFetch(
      'No New Events!',
      'No Upcoming Events!',
      'No Past Events To Review!'
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByText(/no new events/i)).toBeInTheDocument()
    })
  })

  test('shows upcoming event when available', async () => {
    mockFetch(
      { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga', registration_id: 1 },
      { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
      { title: 'Past Event', event_id: 1 }
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByText(/chess club/i)).toBeInTheDocument()
    })
  })

  test('shows no upcoming events message when none available', async () => {
    mockFetch(
      'No New Events!',
      'No Upcoming Events!',
      'No Past Events To Review!'
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByText(/no upcoming events/i)).toBeInTheDocument()
    })
  })

  test('shows past event for feedback', async () => {
    mockFetch(
      { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga', registration_id: 1 },
      { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
      { title: 'Past Event', event_id: 1 }
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByText(/past event/i)).toBeInTheDocument()
    })
  })

  test('shows star rating when past event exists', async () => {
    mockFetch(
      { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga', registration_id: 1 },
      { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
      { title: 'Past Event', event_id: 1 }
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getAllByText('★')).toHaveLength(5)
    })
  })

  test('does not show star rating when no past events', async () => {
    mockFetch(
      'No New Events!',
      'No Upcoming Events!',
      'No Past Events To Review!'
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
      expect(screen.queryByText('★')).not.toBeInTheDocument()
    })
  })

  test('shows join button for new events', async () => {
    mockFetch(
      { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga', registration_id: 1 },
      { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
      { title: 'Past Event', event_id: 1 }
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /join/i })).toBeInTheDocument()
    })
  })

  test('clicking a star sends feedback', async () => {
    mockFetch(
      { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga', registration_id: 1 },
      { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
      { title: 'Past Event', event_id: 1 }
    )
    global.fetch.mockResolvedValue({ json: async () => ({ success: true }) })
    render(<Home {...defaultProps} />)
    await waitFor(() => screen.getAllByText('★'))
    const stars = screen.getAllByText('★')
    fireEvent.click(stars[2])
    expect(global.fetch).toHaveBeenCalled()
  })
  test('clicking join button calls joinEvent', async () => {
  mockFetch(
    { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga', registration_id: 1 },
    { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
    { title: 'Past Event', event_id: 1 }
  )
  global.fetch.mockResolvedValue({ json: async () => ({}) })
  render(<Home {...defaultProps} />)
  await waitFor(() => screen.getByRole('button', { name: /join/i }))
  fireEvent.click(screen.getByRole('button', { name: /join/i }))
  expect(global.fetch).toHaveBeenCalled()
})

test('hovering over a star updates hover state', async () => {
  mockFetch(
    { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga', registration_id: 1 },
    { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
    { title: 'Past Event', event_id: 1 }
  )
  render(<Home {...defaultProps} />)
  await waitFor(() => screen.getAllByText('★'))
  const stars = screen.getAllByText('★')
  fireEvent.mouseEnter(stars[0])
  expect(stars[0].className).toContain('active')
  fireEvent.mouseLeave(stars[0])
  expect(stars[0].className).not.toContain('active')
})

test('shows event time when description contains time', async () => {
    mockFetch(
        { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga\n\nEvent time: 14:30', registration_id: 1 },
        { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess\n\nEvent time: 09:00' },
        { title: 'Past Event', event_id: 1 }
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
        expect(screen.getByText(/2:30 PM/i)).toBeInTheDocument()
    })
})

test('shows AM time correctly', async () => {
    mockFetch(
        { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga\n\nEvent time: 09:00', registration_id: 1 },
        { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
        { title: 'Past Event', event_id: 1 }
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
        expect(screen.getByText(/9:00 AM/i)).toBeInTheDocument()
    })
})

test('shows midnight as 12:00 AM', async () => {
    mockFetch(
        { title: 'Yoga Class', location: 'London', event_date: '2025-01-01', description: 'Fun yoga\n\nEvent time: 00:00', registration_id: 1 },
        { title: 'Chess Club', location: 'Manchester', event_date: '2025-02-01', description: 'Play chess' },
        { title: 'Past Event', event_id: 1 }
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
        expect(screen.getByText(/12:00 AM/i)).toBeInTheDocument()
    })
})

test('clears registration ID when no new events', async () => {
    mockFetch(
        'No New Events!',
        'No Upcoming Events!',
        'No Past Events To Review!'
    )
    render(<Home {...defaultProps} />)
    await waitFor(() => {
        expect(screen.getByText(/no new events/i)).toBeInTheDocument()
    })
    // join button should not exist since registrationID is null
    expect(screen.queryByRole('button', { name: /join/i })).not.toBeInTheDocument()
})
})