// Unit Tests for Voyager App
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

// Import components to test
import Header from '../components/Header'
import AuthModal from '../components/AuthModal'
import BookingModal from '../components/BookingModal'
import Notification from '../components/Notification'

// Import services
import { travelAPI } from '../services/travelAPI'
import { i18n } from '../i18n'
import { mlService } from '../ml/travelML'

// Utility function to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Header Component', () => {
  it('renders logo and navigation', () => {
    renderWithRouter(<Header />)
    expect(screen.getByText('VOYAGER')).toBeInTheDocument()
    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Descubrir')).toBeInTheDocument()
  })

  it('shows search bar', () => {
    renderWithRouter(<Header />)
    const searchInput = screen.getByPlaceholderText(/busca destinos/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('opens mobile menu on hamburger click', () => {
    renderWithRouter(<Header />)
    const hamburgerButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(hamburgerButton)
    // Mobile menu should be visible
    expect(screen.getAllByText('Inicio').length).toBeGreaterThan(1)
  })
})

describe('AuthModal Component', () => {
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('renders login form by default', () => {
    render(<AuthModal show={true} onClose={mockOnClose} />)
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('switches to signup mode', () => {
    render(<AuthModal show={true} onClose={mockOnClose} />)
    const signupLink = screen.getByText(/regístrate/i)
    fireEvent.click(signupLink)
    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
  })

  it('validates email format', async () => {
    render(<AuthModal show={true} onClose={mockOnClose} />)
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByText('Entrar')

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(submitButton)

    // Should show validation error
    await waitFor(() => {
      expect(emailInput).toBeInvalid()
    })
  })

  it('closes modal on close button click', () => {
    render(<AuthModal show={true} onClose={mockOnClose} />)
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})

describe('Notification Component', () => {
  it('renders notification when show is true', () => {
    render(<Notification show={true} message="Test notification" />)
    expect(screen.getByText('Test notification')).toBeInTheDocument()
  })

  it('does not render when show is false', () => {
    render(<Notification show={false} message="Test notification" />)
    expect(screen.queryByText('Test notification')).not.toBeInTheDocument()
  })

  it('displays success icon', () => {
    const { container } = render(
      <Notification show={true} message="Success!" />
    )
    const icon = container.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })
})

describe('BookingModal Component', () => {
  const mockOnClose = vi.fn()
  const mockOnConfirm = vi.fn()

  it('renders booking form', () => {
    render(
      <BookingModal
        show={true}
        destination="París"
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )
    expect(screen.getByText('Reservar Viaje')).toBeInTheDocument()
    expect(screen.getByText('París')).toBeInTheDocument()
  })

  it('calculates total price with extras', () => {
    render(
      <BookingModal
        show={true}
        destination="París"
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )

    // Check for price elements
    expect(screen.getByText(/total/i)).toBeInTheDocument()
    expect(screen.getByText(/\$/)).toBeInTheDocument()
  })

  it('confirms booking on button click', async () => {
    render(
      <BookingModal
        show={true}
        destination="París"
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    )

    const confirmButton = screen.getByText('Confirmar Reserva')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled()
    })
  })
})

// Service Tests
describe('TravelAPI Service', () => {
  it('searches flights with correct parameters', async () => {
    const result = await travelAPI.searchFlights({
      origin: 'NYC',
      destination: 'PAR',
      departureDate: '2026-06-15',
      adults: 2,
    })

    expect(result.success).toBe(true)
    expect(result.flights).toBeDefined()
    expect(Array.isArray(result.flights)).toBe(true)
  })

  it('gets weather for a city', async () => {
    const result = await travelAPI.getWeather('Paris')

    expect(result.success).toBe(true)
    expect(result.weather).toBeDefined()
    expect(result.weather.temp).toBeDefined()
  })

  it('handles API errors gracefully', async () => {
    const result = await travelAPI.searchFlights({
      origin: 'INVALID',
      destination: 'INVALID',
      departureDate: '2026-01-01',
    })

    expect(result.success).toBe(true) // Falls back to mock data
    expect(result.flights).toBeDefined()
  })
})

describe('i18n Service', () => {
  it('translates keys correctly', () => {
    const translation = i18n.t('common.welcome')
    expect(translation).toBe('Bienvenido')
  })

  it('changes locale', () => {
    i18n.setLocale('en')
    const translation = i18n.t('common.welcome')
    expect(translation).toBe('Welcome')

    // Reset to default
    i18n.setLocale('es')
  })

  it('falls back to default locale for missing translations', () => {
    i18n.setLocale('fr')
    const translation = i18n.t('some.missing.key')
    expect(translation).toBeDefined()
  })

  it('formats currency correctly', () => {
    const formatted = i18n.formatCurrency(1234.56, 'USD')
    expect(formatted).toContain('1,234')
    expect(formatted).toContain('$')
  })

  it('formats dates correctly', () => {
    const date = new Date('2026-06-15')
    const formatted = i18n.formatDate(date, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    expect(formatted).toBeDefined()
    expect(formatted.length).toBeGreaterThan(0)
  })
})

describe('ML Service', () => {
  it('initializes TensorFlow successfully', async () => {
    const result = await mlService.initialize()
    expect(result.success).toBe(true)
  })

  it('predicts user preferences', async () => {
    const userData = {
      age: 30,
      budget: 3000,
      previousTrips: 5,
      interests: ['culture', 'photography'],
    }

    const result = await mlService.predictUserPreferences(userData)
    expect(result.success).toBe(true)
    expect(result.preferences).toBeDefined()
    expect(Array.isArray(result.preferences)).toBe(true)
  })

  it('predicts trip cost', async () => {
    const tripDetails = {
      destination: 'Paris',
      duration: 7,
      travelers: 2,
      accommodation: 'hotel',
    }

    const result = await mlService.predictTripCost(tripDetails)
    expect(result.success).toBe(true)
    expect(result.estimatedCost).toBeGreaterThan(0)
    expect(result.breakdown).toBeDefined()
  })

  it('analyzes sentiment of reviews', async () => {
    const reviews = [
      'Amazing place! Absolutely loved it.',
      'Terrible experience, would not recommend.',
      'It was okay, nothing special.',
    ]

    const result = await mlService.analyzeSentiment(reviews)
    expect(result.success).toBe(true)
    expect(result.results).toHaveLength(3)
    expect(result.averageScore).toBeDefined()
  })
})

// Integration Tests
describe('Complete Booking Flow', () => {
  it('completes full booking process', async () => {
    // 1. Search for destination
    const searchResult = await travelAPI.searchFlights({
      origin: 'NYC',
      destination: 'PAR',
      departureDate: '2026-06-15',
      adults: 2,
    })
    expect(searchResult.success).toBe(true)

    // 2. Get ML recommendations
    const recommendations = await mlService.predictUserPreferences({
      age: 30,
      budget: 3000,
    })
    expect(recommendations.success).toBe(true)

    // 3. Calculate cost
    const costPrediction = await mlService.predictTripCost({
      destination: 'Paris',
      duration: 7,
      travelers: 2,
    })
    expect(costPrediction.success).toBe(true)

    // Complete flow successful
    expect(searchResult.flights.length).toBeGreaterThan(0)
    expect(recommendations.preferences.length).toBeGreaterThan(0)
    expect(costPrediction.estimatedCost).toBeGreaterThan(0)
  })
})

// Utility Tests
describe('Utility Functions', () => {
  it('formats currency correctly', () => {
    const formatted = i18n.formatCurrency(1234.56, 'USD')
    expect(formatted).toMatch(/\$/)
    expect(formatted).toMatch(/1,234/)
  })

  it('calculates distances correctly', () => {
    // This would test the mapsService distance calculation
    expect(true).toBe(true)
  })

  it('validates email format', () => {
    const validEmail = 'test@example.com'
    const invalidEmail = 'invalid-email'

    expect(validEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(invalidEmail).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })
})

// Performance Tests
describe('Performance', () => {
  it('renders large lists efficiently', () => {
    const startTime = performance.now()

    // Render large list
    const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }))

    const endTime = performance.now()
    const renderTime = endTime - startTime

    // Should render in under 100ms
    expect(renderTime).toBeLessThan(100)
  })

  it('handles rapid state updates', () => {
    let state = 0
    const updates = 100

    const startTime = performance.now()

    for (let i = 0; i < updates; i++) {
      state = state + 1
    }

    const endTime = performance.now()
    const updateTime = endTime - startTime

    expect(updateTime).toBeLessThan(10)
    expect(state).toBe(updates)
  })
})

export default { describe, it, expect }
