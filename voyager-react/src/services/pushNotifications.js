// Push Notifications Service using Firebase Cloud Messaging (FCM)
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from './auth'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY

class PushNotificationService {
  constructor() {
    this.messaging = null
    this.currentToken = null
  }

  // Initialize FCM
  async initialize() {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        this.messaging = getMessaging()
        return { success: true }
      }
      return { success: false, error: 'Push notifications not supported' }
    } catch (error) {
      console.error('Error initializing FCM:', error)
      return { success: false, error: error.message }
    }
  }

  // Request permission and get token
  async requestPermission(userId) {
    try {
      const permission = await Notification.requestPermission()
      
      if (permission === 'granted') {
        console.log('Notification permission granted')
        
        // Get FCM token
        const token = await getToken(this.messaging, {
          vapidKey: VAPID_KEY,
        })

        if (token) {
          this.currentToken = token
          console.log('FCM Token:', token)

          // Save token to user document
          if (userId) {
            await this.saveTokenToUser(userId, token)
          }

          // Setup foreground message handler
          this.setupForegroundHandler()

          return { success: true, token }
        } else {
          console.log('No registration token available')
          return { success: false, error: 'Failed to get token' }
        }
      } else if (permission === 'denied') {
        console.log('Notification permission denied')
        return { success: false, error: 'Permission denied' }
      } else {
        return { success: false, error: 'Permission not granted' }
      }
    } catch (error) {
      console.error('Error requesting permission:', error)
      return { success: false, error: error.message }
    }
  }

  // Save FCM token to Firestore
  async saveTokenToUser(userId, token) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        fcmTokens: [token], // Array to support multiple devices
        lastTokenUpdate: new Date().toISOString(),
      })
      console.log('Token saved to Firestore')
    } catch (error) {
      console.error('Error saving token:', error)
    }
  }

  // Setup foreground message handler
  setupForegroundHandler() {
    if (!this.messaging) return

    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload)

      const { notification, data } = payload

      // Show browser notification
      if (notification) {
        this.showNotification(
          notification.title,
          notification.body,
          notification.image,
          data
        )
      }

      // Trigger custom event for app to handle
      window.dispatchEvent(
        new CustomEvent('pushNotification', {
          detail: payload,
        })
      )
    })
  }

  // Show browser notification
  showNotification(title, body, image, data = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const options = {
        body: body,
        icon: image || '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: data,
        actions: [
          { action: 'open', title: 'Ver', icon: '/icons/view.png' },
          { action: 'close', title: 'Cerrar', icon: '/icons/close.png' },
        ],
        requireInteraction: false,
        tag: data.tag || 'default',
      }

      const notification = new Notification(title, options)

      notification.onclick = (event) => {
        event.preventDefault()
        window.focus()
        if (data.url) {
          window.location.href = data.url
        }
        notification.close()
      }
    }
  }

  // Subscribe to topic
  async subscribeToTopic(topic) {
    // This requires server-side implementation
    // Call your backend API to subscribe the token to a topic
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: this.currentToken,
          topic: topic,
        }),
      })

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error subscribing to topic:', error)
      return { success: false, error: error.message }
    }
  }

  // Send notification (requires backend)
  async sendNotification(userId, notification) {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          notification: {
            title: notification.title,
            body: notification.body,
            image: notification.image,
            data: notification.data || {},
          },
        }),
      })

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Error sending notification:', error)
      return { success: false, error: error.message }
    }
  }

  // Predefined notification templates
  templates = {
    tripReminder: (destination, daysLeft) => ({
      title: '🗓️ Recordatorio de Viaje',
      body: `Tu viaje a ${destination} es en ${daysLeft} días. ¡Prepara tu equipaje!`,
      image: '/images/trip-reminder.png',
      data: {
        type: 'trip-reminder',
        destination,
        url: '/my-trips',
      },
    }),

    priceAlert: (destination, oldPrice, newPrice) => ({
      title: '💰 Alerta de Precio',
      body: `¡Precio reducido! ${destination}: $${oldPrice} → $${newPrice}`,
      image: '/images/price-alert.png',
      data: {
        type: 'price-alert',
        destination,
        url: '/discover',
      },
    }),

    chatMessage: (senderName, message) => ({
      title: `💬 ${senderName}`,
      body: message,
      data: {
        type: 'chat-message',
        url: '/chat',
      },
    }),

    newRecommendation: (destination) => ({
      title: '✨ Nueva Recomendación',
      body: `Tenemos el destino perfecto para ti: ${destination}`,
      image: '/images/recommendation.png',
      data: {
        type: 'recommendation',
        destination,
        url: '/discover',
      },
    }),

    bookingConfirmed: (destination, date) => ({
      title: '✅ Reserva Confirmada',
      body: `Tu viaje a ${destination} está confirmado para ${date}`,
      image: '/images/booking-confirmed.png',
      data: {
        type: 'booking-confirmed',
        destination,
        url: '/my-trips',
      },
    }),

    weatherAlert: (destination, alert) => ({
      title: '⛈️ Alerta Meteorológica',
      body: `${alert} en ${destination}. Revisa tu itinerario.`,
      data: {
        type: 'weather-alert',
        destination,
        url: '/my-trips',
      },
    }),

    nearbyTraveler: (travelerName, distance) => ({
      title: '👋 Viajero Cercano',
      body: `${travelerName} está a ${distance}km de ti. ¡Di hola!`,
      data: {
        type: 'nearby-traveler',
        url: '/chat',
      },
    }),

    itineraryShared: (userName, destination) => ({
      title: '📍 Itinerario Compartido',
      body: `${userName} compartió su itinerario de ${destination} contigo`,
      data: {
        type: 'itinerary-shared',
        url: '/itineraries',
      },
    }),
  }

  // Schedule local notification
  async scheduleNotification(notification, delayMs) {
    setTimeout(() => {
      this.showNotification(
        notification.title,
        notification.body,
        notification.image,
        notification.data
      )
    }, delayMs)
  }

  // Get notification permission status
  getPermissionStatus() {
    if ('Notification' in window) {
      return Notification.permission // 'granted', 'denied', or 'default'
    }
    return 'not-supported'
  }

  // Check if notifications are supported
  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator
  }

  // Unsubscribe from notifications
  async unsubscribe(userId) {
    try {
      if (userId && this.currentToken) {
        const userRef = doc(db, 'users', userId)
        await updateDoc(userRef, {
          fcmTokens: [],
        })
      }
      this.currentToken = null
      return { success: true }
    } catch (error) {
      console.error('Error unsubscribing:', error)
      return { success: false, error: error.message }
    }
  }
}

export const pushNotifications = new PushNotificationService()
export default pushNotifications

// React Hook for notifications
export const usePushNotifications = () => {
  const [permission, setPermission] = React.useState('default')
  const [token, setToken] = React.useState(null)

  React.useEffect(() => {
    const status = pushNotifications.getPermissionStatus()
    setPermission(status)

    // Listen for custom notification events
    const handleNotification = (event) => {
      console.log('Notification received:', event.detail)
    }

    window.addEventListener('pushNotification', handleNotification)
    return () => window.removeEventListener('pushNotification', handleNotification)
  }, [])

  const requestPermission = async (userId) => {
    await pushNotifications.initialize()
    const result = await pushNotifications.requestPermission(userId)
    if (result.success) {
      setPermission('granted')
      setToken(result.token)
    }
    return result
  }

  return {
    permission,
    token,
    requestPermission,
    isSupported: pushNotifications.isSupported(),
  }
}
