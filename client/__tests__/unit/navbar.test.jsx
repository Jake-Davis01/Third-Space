import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NavBar from '../../src/components/navbar.jsx'

describe('NavBar component', () => {
  test('renders standard links', () => {
    render(<MemoryRouter><NavBar isEO={false} /></MemoryRouter>)
    expect(screen.getByText(/home/i)).toBeInTheDocument()
    expect(screen.getByText(/events/i)).toBeInTheDocument()
    expect(screen.getByText(/profile/i)).toBeInTheDocument()
    expect(screen.getByText(/logout/i)).toBeInTheDocument()
  })

  test('does not show dashboard or AI links for regular users', () => {
    render(<MemoryRouter><NavBar isEO={false} /></MemoryRouter>)
    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/ai/i)).not.toBeInTheDocument()
  })

  test('shows dashboard and AI links for event organisers', () => {
    render(<MemoryRouter><NavBar isEO={true} /></MemoryRouter>)
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/ai/i)).toBeInTheDocument()
  })
})