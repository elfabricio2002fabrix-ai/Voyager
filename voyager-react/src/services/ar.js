// Augmented Reality Service for Destination Preview
// Uses WebXR and AR.js for immersive experiences

class ARDestinationService {
  constructor() {
    this.isARSupported = false
    this.session = null
    this.markers = []
  }

  // Check AR support
  async checkARSupport() {
    try {
      if ('xr' in navigator) {
        this.isARSupported = await navigator.xr.isSessionSupported('immersive-ar')
        return { supported: this.isARSupported }
      }
      return { supported: false, reason: 'WebXR not available' }
    } catch (error) {
      console.error('Error checking AR support:', error)
      return { supported: false, reason: error.message }
    }
  }

  // Start AR session
  async startARSession() {
    try {
      if (!this.isARSupported) {
        return { success: false, error: 'AR not supported' }
      }

      this.session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'dom-overlay'],
        optionalFeatures: ['anchors'],
      })

      return { success: true, session: this.session }
    } catch (error) {
      console.error('Error starting AR session:', error)
      return { success: false, error: error.message }
    }
  }

  // Place 3D model in AR
  async place3DModel(modelUrl, position = { x: 0, y: 0, z: -2 }) {
    try {
      // This would use THREE.js or A-Frame in production
      const model = {
        url: modelUrl,
        position: position,
        scale: { x: 1, y: 1, z: 1 },
        rotation: { x: 0, y: 0, z: 0 },
      }

      this.markers.push(model)

      return {
        success: true,
        model,
        message: 'Model placed in AR',
      }
    } catch (error) {
      console.error('Error placing 3D model:', error)
      return { success: false, error: error.message }
    }
  }

  // Virtual tour destinations
  virtualTours = {
    'Eiffel Tower': {
      modelUrl: '/models/eiffel-tower.glb',
      thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      description: 'Iconic iron lattice tower in Paris',
      hotspots: [
        { x: 0, y: 50, z: 0, info: 'Observation Deck - 276m high' },
        { x: -20, y: 0, z: 0, info: 'First Floor Restaurant' },
      ],
    },
    'Machu Picchu': {
      modelUrl: '/models/machu-picchu.glb',
      thumbnail: 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4',
      description: 'Ancient Incan citadel in Peru',
      hotspots: [
        { x: 0, y: 0, z: 0, info: 'Main Plaza' },
        { x: 50, y: 20, z: 30, info: 'Temple of the Sun' },
      ],
    },
    'Great Wall': {
      modelUrl: '/models/great-wall.glb',
      thumbnail: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d',
      description: 'Historic fortification in China',
      hotspots: [
        { x: 0, y: 0, z: 0, info: 'Watchtower' },
      ],
    },
  }

  // Start virtual tour
  async startVirtualTour(destinationName) {
    const tour = this.virtualTours[destinationName]

    if (!tour) {
      return {
        success: false,
        error: 'Tour not found',
        available: Object.keys(this.virtualTours),
      }
    }

    return {
      success: true,
      tour: {
        ...tour,
        instructions: [
          'Point your camera at a flat surface',
          'Tap to place the 3D model',
          'Pinch to zoom, drag to rotate',
          'Tap hotspots for information',
        ],
      },
    }
  }

  // AR Image Recognition (for travel brochures/postcards)
  async recognizeImage(imageData) {
    // In production, use image recognition API or ML model
    const knownImages = [
      {
        id: 'eiffel-postcard',
        destination: 'Paris',
        model: 'Eiffel Tower',
        action: 'show_info',
      },
      {
        id: 'statue-liberty',
        destination: 'New York',
        model: 'Statue of Liberty',
        action: 'show_info',
      },
    ]

    // Simulate recognition
    const recognized = knownImages[0] // In production, use actual recognition

    return {
      success: true,
      recognized,
      arContent: {
        modelUrl: this.virtualTours[recognized.model]?.modelUrl,
        info: this.virtualTours[recognized.model]?.description,
      },
    }
  }

  // AR Navigation overlay
  async createNavigationOverlay(route) {
    const { start, end, waypoints = [] } = route

    const overlay = {
      type: 'navigation',
      elements: [
        {
          type: 'arrow',
          direction: this.calculateDirection(start, waypoints[0] || end),
          distance: this.calculateDistance(start, waypoints[0] || end),
        },
        {
          type: 'info_panel',
          content: `${Math.round(this.calculateDistance(start, end))}m to destination`,
        },
      ],
    }

    return {
      success: true,
      overlay,
    }
  }

  calculateDirection(from, to) {
    const angle = Math.atan2(to.lat - from.lat, to.lng - from.lng)
    return (angle * 180) / Math.PI
  }

  calculateDistance(from, to) {
    const R = 6371e3 // Earth radius in meters
    const φ1 = (from.lat * Math.PI) / 180
    const φ2 = (to.lat * Math.PI) / 180
    const Δφ = ((to.lat - from.lat) * Math.PI) / 180
    const Δλ = ((to.lng - from.lng) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // AR Filters (like Instagram/Snapchat for travel photos)
  arFilters = [
    {
      id: 'traveler-hat',
      name: 'Traveler Hat',
      thumbnail: '/filters/hat.png',
      category: 'accessories',
    },
    {
      id: 'landmark-overlay',
      name: 'Landmark Frame',
      thumbnail: '/filters/landmark.png',
      category: 'frames',
    },
    {
      id: 'passport-stamp',
      name: 'Passport Stamp',
      thumbnail: '/filters/stamp.png',
      category: 'stickers',
    },
  ]

  async applyARFilter(filterId, imageElement) {
    const filter = this.arFilters.find((f) => f.id === filterId)

    if (!filter) {
      return { success: false, error: 'Filter not found' }
    }

    // In production, apply actual AR filter using canvas/WebGL
    return {
      success: true,
      filter,
      message: 'Filter applied',
    }
  }

  // Measure distance in AR (for checking luggage dimensions, etc.)
  async measureDistance(point1, point2) {
    const distance = Math.sqrt(
      Math.pow(point2.x - point1.x, 2) +
        Math.pow(point2.y - point1.y, 2) +
        Math.pow(point2.z - point1.z, 2)
    )

    return {
      success: true,
      distance: distance.toFixed(2),
      unit: 'meters',
    }
  }

  // AR Preview of hotel room
  async previewHotelRoom(hotelId, roomType) {
    return {
      success: true,
      preview: {
        modelUrl: `/models/hotels/${hotelId}/${roomType}.glb`,
        images360: [
          `/360/hotels/${hotelId}/${roomType}_1.jpg`,
          `/360/hotels/${hotelId}/${roomType}_2.jpg`,
        ],
        features: [
          'King Size Bed',
          'Ocean View',
          'Private Balcony',
          'Modern Bathroom',
        ],
        dimensions: {
          area: '35 m²',
          height: '3 m',
        },
      },
    }
  }

  // AR Restaurant Menu (translate and visualize dishes)
  async visualizeMenu(dish) {
    return {
      success: true,
      visualization: {
        modelUrl: `/models/food/${dish.id}.glb`,
        ingredients: dish.ingredients,
        nutrition: dish.nutrition,
        allergens: dish.allergens,
        translation: {
          en: dish.nameEn,
          es: dish.nameEs,
        },
      },
    }
  }

  // End AR session
  async endSession() {
    if (this.session) {
      await this.session.end()
      this.session = null
      this.markers = []
    }
    return { success: true }
  }

  // Get available AR experiences
  getAvailableExperiences() {
    return {
      virtualTours: Object.keys(this.virtualTours),
      filters: this.arFilters.map((f) => ({ id: f.id, name: f.name })),
      features: [
        '3D Destination Models',
        'Virtual Tours',
        'AR Navigation',
        'Photo Filters',
        'Hotel Room Preview',
        'Menu Visualization',
        'Distance Measurement',
      ],
    }
  }
}

export const arService = new ARDestinationService()
export default arService

// React Hook for AR
import { useState, useEffect } from 'react'

export const useAR = () => {
  const [isSupported, setIsSupported] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    const checkSupport = async () => {
      const result = await arService.checkARSupport()
      setIsSupported(result.supported)
    }
    checkSupport()
  }, [])

  const startAR = async () => {
    const result = await arService.startARSession()
    if (result.success) {
      setSession(result.session)
      setIsActive(true)
    }
    return result
  }

  const endAR = async () => {
    await arService.endSession()
    setSession(null)
    setIsActive(false)
  }

  return {
    isSupported,
    isActive,
    session,
    startAR,
    endAR,
  }
}
