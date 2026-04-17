import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import SignUp from '../../src/components/signup.jsx'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('SignUp component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    global.fetch = vi.fn()
  })

  test('renders the signup form', () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  test('shows error if fewer than 3 interests selected', async () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/at least 3 interests/i)).toBeInTheDocument()
    })
  })

  test('navigates to /home on successful registration', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'success' })
    })
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /running/i }))
    fireEvent.click(screen.getByRole('button', { name: /film/i }))
    fireEvent.click(screen.getByRole('button', { name: /gaming/i }))
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home')
    })
  })

  test('shows error on failed registration', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Registration failed' })
    })
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /running/i }))
    fireEvent.click(screen.getByRole('button', { name: /film/i }))
    fireEvent.click(screen.getByRole('button', { name: /gaming/i }))
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
    })
  })

  test('can deselect an interest', () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /running/i }))
    fireEvent.click(screen.getByRole('button', { name: /running/i }))
    expect(screen.getByText(/0 of 5 selected/i)).toBeInTheDocument()
  })

  test('cannot select more than 5 interests', () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: /running/i }))
    fireEvent.click(screen.getByRole('button', { name: /film/i }))
    fireEvent.click(screen.getByRole('button', { name: /gaming/i }))
    fireEvent.click(screen.getByRole('button', { name: /cooking/i }))
    fireEvent.click(screen.getByRole('button', { name: /hiking/i }))
    fireEvent.click(screen.getByRole('button', { name: /yoga/i }))
    expect(screen.getByText(/5 of 5 selected/i)).toBeInTheDocument()
  })

  test('navigates to sign in when clicking sign in link', () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    fireEvent.click(screen.getByText(/sign in/i))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('updates form fields on change', () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    fireEvent.change(screen.getByPlaceholderText('First name'), { target: { name: 'first_name', value: 'John' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { name: 'email', value: 'john@test.com' } })
    expect(screen.getByPlaceholderText('First name').value).toBe('John')
    expect(screen.getByPlaceholderText('Email').value).toBe('john@test.com')
  })

  test('can change meetup preference', () => {
    render(<MemoryRouter><SignUp /></MemoryRouter>)
    fireEvent.click(screen.getByRole('radio', { name: /online only/i }))
    expect(screen.getByRole('radio', { name: /online only/i })).toBeChecked()
    fireEvent.click(screen.getByRole('radio', { name: /in person only/i }))
    expect(screen.getByRole('radio', { name: /in person only/i })).toBeChecked()
    fireEvent.click(screen.getByRole('radio', { name: /either/i }))
    expect(screen.getByRole('radio', { name: /either/i })).toBeChecked()
  })
})