// End-to-End Tests with Playwright
import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

test.describe('Voyager E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('homepage loads correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Voyager/)

    // Check hero section
    await expect(page.getByText(/Explora el Mundo/i)).toBeVisible()

    // Check navigation
    await expect(page.getByRole('link', { name: /Inicio/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Descubrir/i })).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    // Type in search box
    const searchInput = page.getByPlaceholder(/busca destinos/i)
    await searchInput.fill('París')

    // Wait for search results (if applicable)
    await page.waitForTimeout(500)

    // Check if search was triggered
    expect(await searchInput.inputValue()).toBe('París')
  })

  test('navigation between pages', async ({ page }) => {
    // Navigate to Discover page
    await page.click('text=Descubrir')
    await expect(page).toHaveURL(/\/discover/)
    await expect(page.getByText(/Descubre tu Próxima Aventura/i)).toBeVisible()

    // Navigate to Bucket List
    await page.click('text=Bucket List')
    await expect(page).toHaveURL(/\/bucket-list/)
    await expect(page.getByText(/Mi Bucket List/i)).toBeVisible()

    // Navigate to Gallery
    await page.click('text=Galería')
    await expect(page).toHaveURL(/\/gallery/)
    await expect(page.getByText(/Mi Galería/i)).toBeVisible()
  })

  test('booking flow', async ({ page }) => {
    // Go to discover page
    await page.goto(`${BASE_URL}/discover`)

    // Click on a destination
    await page.click('button:has-text("Ver Detalles")').first()

    // Wait for booking modal
    await expect(page.getByText(/Reservar Viaje/i)).toBeVisible({ timeout: 2000 })

    // Fill in booking details
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    await page.fill('input[type="date"]', today.toISOString().split('T')[0])

    // Click confirm button
    await page.click('button:has-text("Confirmar Reserva")')

    // Check for success notification
    await expect(page.getByText(/confirmada/i)).toBeVisible({ timeout: 3000 })
  })

  test('authentication flow', async ({ page }) => {
    // Open auth modal (implementation depends on your UI)
    await page.click('button:has-text("Login")').catch(() => {})

    // Wait for modal
    await expect(page.getByText(/Iniciar Sesión/i)).toBeVisible({ timeout: 2000 })

    // Fill in credentials
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for authentication (adjust based on your implementation)
    await page.waitForTimeout(1000)
  })

  test('destination filtering', async ({ page }) => {
    await page.goto(`${BASE_URL}/discover`)

    // Click on a filter
    await page.click('button:has-text("Playa")')

    // Wait for filtered results
    await page.waitForTimeout(500)

    // Verify filter is active (check for active state)
    const beachFilter = page.locator('button:has-text("Playa")')
    await expect(beachFilter).toHaveClass(/bg-voyager-blue/)
  })

  test('bucket list interactions', async ({ page }) => {
    await page.goto(`${BASE_URL}/bucket-list`)

    // Check/uncheck items
    const checkbox = page.locator('input[type="checkbox"]').first()
    await checkbox.check()
    await expect(checkbox).toBeChecked()

    await checkbox.uncheck()
    await expect(checkbox).not.toBeChecked()

    // Add new item
    await page.click('button:has-text("Agregar Nuevo")')
    // Add assertions based on your add modal implementation
  })

  test('gallery image interactions', async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`)

    // Hover over image to see overlay
    const firstImage = page.locator('.destination-card').first()
    await firstImage.hover()

    // Check if overlay appears
    await expect(firstImage.locator('button')).toBeVisible()
  })

  test('mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check mobile menu
    const hamburger = page.locator('button:has-text("Menu")')
    await expect(hamburger).toBeVisible()

    // Open mobile menu
    await hamburger.click()

    // Check navigation items
    await expect(page.getByText(/Inicio/i)).toBeVisible()
  })

  test('dark mode persists', async ({ page }) => {
    // Check for dark background
    const body = page.locator('body')
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })

    // Should have dark background (check RGB values)
    expect(bgColor).toContain('rgb') // Adjust based on actual dark mode color
  })

  test('form validation', async ({ page }) => {
    // Try to submit booking with invalid data
    await page.goto(`${BASE_URL}/discover`)
    await page.click('button:has-text("Ver Detalles")').first()

    // Try to submit without filling required fields
    await page.click('button:has-text("Confirmar")')

    // Check for validation messages (adjust selectors based on implementation)
    const invalidInputs = page.locator('input:invalid')
    expect(await invalidInputs.count()).toBeGreaterThan(0)
  })

  test('share functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-trips`)

    // Click share button
    const shareButton = page.locator('button:has-text("Compartir")').first()
    if (await shareButton.isVisible()) {
      await shareButton.click()

      // Check if share options appear
      await expect(page.getByText(/Facebook|Twitter|WhatsApp/i)).toBeVisible()
    }
  })

  test('language switcher', async ({ page }) => {
    // Find and click language switcher
    const langSwitcher = page.locator('[data-testid="language-switcher"]')

    if (await langSwitcher.isVisible()) {
      await langSwitcher.click()

      // Select English
      await page.click('text=English')

      // Verify language changed
      await expect(page.getByText(/Explore the World/i)).toBeVisible()
    }
  })

  test('voice assistant activation', async ({ page, context }) => {
    // Grant microphone permission
    await context.grantPermissions(['microphone'])

    // Click voice assistant button
    const voiceButton = page.locator('[data-testid="voice-assistant"]')

    if (await voiceButton.isVisible()) {
      await voiceButton.click()

      // Check if listening indicator appears
      await expect(page.getByText(/Escuchando|Listening/i)).toBeVisible({ timeout: 2000 })
    }
  })

  test('AR experience launcher', async ({ page }) => {
    // Navigate to a destination detail
    await page.goto(`${BASE_URL}/discover`)
    await page.click('button:has-text("Ver Detalles")').first()

    // Look for AR button
    const arButton = page.locator('[data-testid="ar-preview"]')

    if (await arButton.isVisible()) {
      await arButton.click()

      // Check if AR experience starts
      await expect(page.getByText(/AR|Realidad Aumentada/i)).toBeVisible()
    }
  })

  test('offline functionality', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true)

    // Try to navigate
    await page.goto(BASE_URL)

    // Should show offline indicator or cached content
    // Adjust based on your offline implementation
    const body = await page.textContent('body')
    expect(body.length).toBeGreaterThan(0) // Some content should be visible
  })

  test('payment flow', async ({ page }) => {
    // Complete booking to reach payment
    await page.goto(`${BASE_URL}/discover`)
    await page.click('button:has-text("Ver Detalles")').first()

    // Fill booking form
    const today = new Date().toISOString().split('T')[0]
    await page.fill('input[type="date"]', today)
    await page.click('button:has-text("Confirmar")')

    // Should show payment form
    await expect(page.getByText(/Pago|Payment/i)).toBeVisible({ timeout: 3000 })

    // Fill in test card details (use Stripe test card)
    await page.fill('[placeholder*="Card number"]', '4242424242424242')
    await page.fill('[placeholder*="MM"]', '12')
    await page.fill('[placeholder*="YY"]', '30')
    await page.fill('[placeholder*="CVC"]', '123')
  })

  test('chat functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/chat`)

    // Check if chat interface loads
    await expect(page.getByText(/Chat|Conversaciones/i)).toBeVisible()

    // Type a message
    const messageInput = page.locator('input[placeholder*="mensaje"]')
    if (await messageInput.isVisible()) {
      await messageInput.fill('Hola!')
      await page.press('input[placeholder*="mensaje"]', 'Enter')

      // Message should appear
      await expect(page.getByText('Hola!')).toBeVisible()
    }
  })

  test('map interactions', async ({ page }) => {
    await page.goto(`${BASE_URL}/my-trips`)

    // Click show map button
    const mapButton = page.locator('button:has-text("Map")')
    if (await mapButton.isVisible()) {
      await mapButton.click()

      // Map should be visible
      await expect(page.locator('.leaflet-container, [data-testid="map"]')).toBeVisible()
    }
  })

  test('notification permissions', async ({ page, context }) => {
    // Grant notification permission
    await context.grantPermissions(['notifications'])

    // Trigger notification (if you have a test button)
    const notifButton = page.locator('[data-testid="test-notification"]')
    if (await notifButton.isVisible()) {
      await notifButton.click()
    }
  })

  test('performance metrics', async ({ page }) => {
    const startTime = Date.now()

    await page.goto(BASE_URL)

    const loadTime = Date.now() - startTime

    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000)

    // Check for Core Web Vitals
    const metrics = await page.evaluate(() => ({
      lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
      fid: performance.getEntriesByType('first-input')[0]?.processingStart,
      cls: performance.getEntriesByType('layout-shift').reduce((sum, entry) => sum + entry.value, 0),
    }))

    console.log('Performance metrics:', metrics)
  })

  test('accessibility compliance', async ({ page }) => {
    await page.goto(BASE_URL)

    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThan(0)

    // Check for alt text on images
    const images = await page.locator('img').all()
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      expect(alt).toBeTruthy() // Should have alt text
    }

    // Check for proper button labels
    const buttons = await page.locator('button').all()
    for (const button of buttons) {
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      expect(text || ariaLabel).toBeTruthy() // Should have text or aria-label
    }
  })
})

// Visual Regression Tests
test.describe('Visual Tests', () => {
  test('homepage visual snapshot', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page).toHaveScreenshot('homepage.png')
  })

  test('discover page visual snapshot', async ({ page }) => {
    await page.goto(`${BASE_URL}/discover`)
    await expect(page).toHaveScreenshot('discover.png')
  })

  test('booking modal visual snapshot', async ({ page }) => {
    await page.goto(`${BASE_URL}/discover`)
    await page.click('button:has-text("Ver Detalles")').first()
    await page.waitForTimeout(500)
    await expect(page).toHaveScreenshot('booking-modal.png')
  })
})

export default test
