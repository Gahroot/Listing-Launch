import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import App from './App'

test('renders listing launch heading', () => {
  render(<App />)
  const heading = screen.getByRole('heading', { name: /listing launch/i })
  expect(heading).toBeInTheDocument()
})

test('renders welcome message', () => {
  render(<App />)
  const welcomeText = screen.getByText(/welcome to your listing management application/i)
  expect(welcomeText).toBeInTheDocument()
})
