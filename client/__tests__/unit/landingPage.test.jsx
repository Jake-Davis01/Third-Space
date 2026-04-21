import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LandingPage from '../../src/components/landingPage.jsx'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('LandingPage component', () => {
  const mockSetIsEO = vi.fn()
  const mockSetName = vi.fn()
  const mockSetUserEventEmail = vi.fn()

  beforeEach(() => {
    mockNavigate.mockClear()
    mockSetIsEO.mockClear()
    mockSetName.mockClear()
    mockSetUserEventEmail.mockClear()
    global.fetch = vi.fn()
  })

  const renderComponent = () => render(
    <MemoryRouter>
      <LandingPage
        setIsEO={mockSetIsEO}
        setName={mockSetName}
        setUserEventEmail={mockSetUserEventEmail}
      />
    </MemoryRouter>
  )

  test('renders the login form', () => {
    renderComponent()
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test('navigates to /signup when sign up is clicked', () => {
    renderComponent()
    fireEvent.click(screen.getByText(/sign up/i))
    expect(mockNavigate).toHaveBeenCalledWith('/signup')
  })

  test('navigates to /home on successful login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        email: 'john@test.com',
        firstName: 'John',
        jobRole: 'employee'
      })
    })
    renderComponent()
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'john@test.com' } })
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home')
    })
  })

  test('sets isEO to true for admin users', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        email: 'admin@test.com',
        firstName: 'Admin',
        jobRole: 'admin'
      })
    })
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => {
      expect(mockSetIsEO).toHaveBeenCalledWith(true)
    })
  })

  test('sets isEO to false for employee users', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        email: 'john@test.com',
        firstName: 'John',
        jobRole: 'employee'
      })
    })
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => {
      expect(mockSetIsEO).toHaveBeenCalledWith(false)
    })
  })

  test('does not navigate if user not found', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        error: 'Unable to locate user.'
      })
    })
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith('/home')
    })
  })

  test('saves email to localStorage on successful login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        email: 'john@test.com',
        firstName: 'John',
        jobRole: 'employee'
      })
    })
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => {
      expect(localStorage.getItem('userEmail')).toBe('john@test.com')
    })
  })
})