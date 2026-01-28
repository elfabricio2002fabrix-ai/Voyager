// Stripe Payment Integration Service
import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const API_URL = import.meta.env.VITE_API_URL || '/api'

class StripePaymentService {
  constructor() {
    this.stripe = null
    this.elements = null
  }

  // Initialize Stripe
  async initialize() {
    try {
      this.stripe = await loadStripe(STRIPE_PUBLIC_KEY)
      return { success: true, stripe: this.stripe }
    } catch (error) {
      console.error('Error initializing Stripe:', error)
      return { success: false, error: error.message }
    }
  }

  // Create payment intent
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const response = await fetch(`${API_URL}/payments/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          metadata,
        }),
      })

      const data = await response.json()
      return {
        success: true,
        clientSecret: data.clientSecret,
        paymentIntentId: data.id,
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      return { success: false, error: error.message }
    }
  }

  // Process payment
  async processPayment(elements, bookingDetails) {
    try {
      if (!this.stripe) {
        await this.initialize()
      }

      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-confirmed`,
        },
        redirect: 'if_required',
      })

      if (error) {
        return {
          success: false,
          error: error.message,
        }
      }

      if (paymentIntent.status === 'succeeded') {
        // Save booking to database
        await this.saveBooking(paymentIntent.id, bookingDetails)

        return {
          success: true,
          paymentIntent,
          message: 'Payment successful!',
        }
      }

      return {
        success: false,
        error: 'Payment processing failed',
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      return { success: false, error: error.message }
    }
  }

  // Save booking after successful payment
  async saveBooking(paymentId, bookingDetails) {
    try {
      const response = await fetch(`${API_URL}/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          ...bookingDetails,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        }),
      })

      return await response.json()
    } catch (error) {
      console.error('Error saving booking:', error)
      throw error
    }
  }

  // Create subscription
  async createSubscription(priceId, customerId) {
    try {
      const response = await fetch(`${API_URL}/payments/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerId,
        }),
      })

      const data = await response.json()
      return {
        success: true,
        subscription: data,
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      return { success: false, error: error.message }
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const response = await fetch(
        `${API_URL}/payments/cancel-subscription/${subscriptionId}`,
        {
          method: 'POST',
        }
      )

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return { success: false, error: error.message }
    }
  }

  // Process refund
  async processRefund(paymentIntentId, amount = null) {
    try {
      const response = await fetch(`${API_URL}/payments/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount: amount ? Math.round(amount * 100) : null,
        }),
      })

      const data = await response.json()
      return { success: true, refund: data }
    } catch (error) {
      console.error('Error processing refund:', error)
      return { success: false, error: error.message }
    }
  }

  // Get payment methods for customer
  async getPaymentMethods(customerId) {
    try {
      const response = await fetch(
        `${API_URL}/payments/payment-methods/${customerId}`
      )
      const data = await response.json()
      return { success: true, paymentMethods: data }
    } catch (error) {
      console.error('Error getting payment methods:', error)
      return { success: false, error: error.message }
    }
  }

  // Save payment method
  async savePaymentMethod(paymentMethodId, customerId) {
    try {
      const response = await fetch(`${API_URL}/payments/save-payment-method`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId,
          customerId,
        }),
      })

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error saving payment method:', error)
      return { success: false, error: error.message }
    }
  }

  // Calculate booking price
  calculateBookingPrice(booking) {
    const {
      basePrice = 0,
      nights = 1,
      guests = 1,
      extras = [],
      taxes = 0.1, // 10% tax
      serviceFee = 0.05, // 5% service fee
    } = booking

    const subtotal = basePrice * nights * guests
    const extrasTotal = extras.reduce((sum, extra) => sum + extra.price, 0)
    const beforeTax = subtotal + extrasTotal
    const taxAmount = beforeTax * taxes
    const serviceFeeAmount = beforeTax * serviceFee
    const total = beforeTax + taxAmount + serviceFeeAmount

    return {
      subtotal,
      extrasTotal,
      beforeTax,
      taxAmount,
      serviceFeeAmount,
      total,
      breakdown: {
        'Accommodation': subtotal,
        'Extras': extrasTotal,
        'Service Fee': serviceFeeAmount,
        'Taxes': taxAmount,
      },
    }
  }

  // Payment plans (installments)
  async createPaymentPlan(totalAmount, installments = 3) {
    const installmentAmount = totalAmount / installments
    const plan = []

    for (let i = 0; i < installments; i++) {
      plan.push({
        installment: i + 1,
        amount: installmentAmount,
        dueDate: new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000), // 30 days apart
        status: 'pending',
      })
    }

    return plan
  }

  // Apply promo code
  async applyPromoCode(code, amount) {
    try {
      const response = await fetch(`${API_URL}/payments/apply-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          amount,
        }),
      })

      const data = await response.json()
      return {
        success: true,
        discount: data.discount,
        newAmount: amount - data.discount,
      }
    } catch (error) {
      console.error('Error applying promo code:', error)
      return { success: false, error: error.message }
    }
  }

  // Supported currencies
  currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
    { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  ]

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }
}

export const stripePayments = new StripePaymentService()
export default stripePayments

// React Hook for Stripe Payments
import { useState, useEffect } from 'react'

export const useStripePayment = () => {
  const [stripe, setStripe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initStripe = async () => {
      const result = await stripePayments.initialize()
      if (result.success) {
        setStripe(result.stripe)
      } else {
        setError(result.error)
      }
      setLoading(false)
    }

    initStripe()
  }, [])

  const processPayment = async (elements, bookingDetails) => {
    setLoading(true)
    setError(null)

    const result = await stripePayments.processPayment(elements, bookingDetails)

    if (!result.success) {
      setError(result.error)
    }

    setLoading(false)
    return result
  }

  return {
    stripe,
    loading,
    error,
    processPayment,
  }
}
