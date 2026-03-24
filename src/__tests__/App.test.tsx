import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('should render without crashing', () => {
    render(<App />)
    expect(document.body).toBeInTheDocument()
  })

  it('should display the app content', () => {
    render(<App />)
    expect(screen.getAllByText(/PetHUB/i).length).toBeGreaterThan(0)
  })
})
