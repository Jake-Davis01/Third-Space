
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Profile from '../../src/components/profile.jsx'

describe('Profile component', () => {
  test('renders the profile page', () => {
    render(<Profile />)
    expect(screen.getByText(/your profile/i)).toBeInTheDocument()
  })

  test('renders save changes button', () => {
    render(<Profile />)
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
  })

  test('shows saved confirmation after clicking save', async () => {
    render(<Profile />)
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(screen.getByRole('button', { name: /saved!/i })).toBeInTheDocument()
  })

  test('renders default interests', () => {
    render(<Profile />)
    expect(screen.getByRole('button', { name: /running/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /film/i })).toBeInTheDocument()
  })

  test('can select an interest', () => {
    render(<Profile />)
    fireEvent.click(screen.getByRole('button', { name: /gaming/i }))
    expect(screen.getByText(/3 of 5 selected/i)).toBeInTheDocument()
  })

  test('can deselect an interest', () => {
    render(<Profile />)
    fireEvent.click(screen.getByRole('button', { name: /running/i }))
    expect(screen.getByText(/1 of 5 selected/i)).toBeInTheDocument()
  })

  test('cannot select more than 5 interests', () => {
    render(<Profile />)
    fireEvent.click(screen.getByRole('button', { name: /gaming/i }))
    fireEvent.click(screen.getByRole('button', { name: /cooking/i }))
    fireEvent.click(screen.getByRole('button', { name: /hiking/i }))
    fireEvent.click(screen.getByRole('button', { name: /yoga/i }))
    expect(screen.getByText(/5 of 5 selected/i)).toBeInTheDocument()
  })

  test('can change location', () => {
    render(<Profile />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Manchester — Location' } })
    expect(screen.getByRole('combobox').value).toBe('Manchester — Location')
  })

  test('can change meetup preference to online only', () => {
    render(<Profile />)
    fireEvent.click(screen.getByRole('radio', { name: /online only/i }))
    expect(screen.getByRole('radio', { name: /online only/i })).toBeChecked()
  })

  test('can change meetup preference to in person only', () => {
    render(<Profile />)
    fireEvent.click(screen.getByRole('radio', { name: /in person only/i }))
    expect(screen.getByRole('radio', { name: /in person only/i })).toBeChecked()
  })

  test('either is checked by default', () => {
    render(<Profile />)
    expect(screen.getByRole('radio', { name: /either/i })).toBeChecked()
  })
})