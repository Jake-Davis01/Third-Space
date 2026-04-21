import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Profile from '../../src/components/profile.jsx'

beforeEach(() => {
  localStorage.setItem('userEmail', 'test@test.com')
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      officeLocation: 'birmingham',
      meetupPreference: 'either',
      userInterests: ['Running', 'Film', 'Gaming']
    })
  })
})

afterEach(() => {
  localStorage.clear()
})

describe('Profile component', () => {
  test('shows loading state initially', () => {
    render(<Profile />)
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument()
  })

  test('renders the profile page after loading', async () => {
    render(<Profile />)
    await waitFor(() => expect(screen.getByText(/your profile/i)).toBeInTheDocument())
  })

  test('renders save changes button after loading', async () => {
    render(<Profile />)
    await waitFor(() => expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument())
  })

  test('shows saved confirmation after clicking save', async () => {
    render(<Profile />)
    await waitFor(() => screen.getByRole('button', { name: /save changes/i }))
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    await waitFor(() => expect(screen.getByRole('button', { name: /saved!/i })).toBeInTheDocument())
  })

  test('renders interests after loading', async () => {
    render(<Profile />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /running/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /film/i })).toBeInTheDocument()
    })
  })

  test('can select an interest', async () => {
    render(<Profile />)
    await waitFor(() => screen.getByRole('button', { name: /cooking/i }))
    fireEvent.click(screen.getByRole('button', { name: /cooking/i }))
    expect(screen.getByText(/4 of 5 selected/i)).toBeInTheDocument()
  })

  test('can deselect an interest', async () => {
    render(<Profile />)
    await waitFor(() => screen.getByRole('button', { name: /running/i }))
    fireEvent.click(screen.getByRole('button', { name: /running/i }))
    expect(screen.getByText(/2 of 5 selected/i)).toBeInTheDocument()
  })

  test('cannot select more than 5 interests', async () => {
    render(<Profile />)
    await waitFor(() => screen.getByRole('button', { name: /cooking/i }))
    fireEvent.click(screen.getByRole('button', { name: /cooking/i }))
    fireEvent.click(screen.getByRole('button', { name: /hiking/i }))
    expect(screen.getByText(/5 of 5 selected/i)).toBeInTheDocument()
  })

  test('can change location', async () => {
    render(<Profile />)
    await waitFor(() => screen.getByRole('combobox'))
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'manchester' } })
    expect(screen.getByRole('combobox').value).toBe('manchester')
  })

  test('can change meetup preference to online only', async () => {
    render(<Profile />)
    await waitFor(() => screen.getByRole('radio', { name: /online only/i }))
    fireEvent.click(screen.getByRole('radio', { name: /online only/i }))
    expect(screen.getByRole('radio', { name: /online only/i })).toBeChecked()
  })

  test('can change meetup preference to in person only', async () => {
    render(<Profile />)
    await waitFor(() => screen.getByRole('radio', { name: /in person only/i }))
    fireEvent.click(screen.getByRole('radio', { name: /in person only/i }))
    expect(screen.getByRole('radio', { name: /in person only/i })).toBeChecked()
  })

  test('either is checked by default', async () => {
    render(<Profile />)
    await waitFor(() => screen.getByRole('radio', { name: /either/i }))
    expect(screen.getByRole('radio', { name: /either/i })).toBeChecked()
  })

  test('shows alert if fewer than 3 interests on save', async () => {
    window.alert = vi.fn()
    render(<Profile />)
    await waitFor(() => screen.getByRole('button', { name: /running/i }))
    fireEvent.click(screen.getByRole('button', { name: /running/i }))
    fireEvent.click(screen.getByRole('button', { name: /film/i }))
    fireEvent.click(screen.getByRole('button', { name: /gaming/i }))
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(window.alert).toHaveBeenCalledWith('Please select at least 3 interests.')
  })
})