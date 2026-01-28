// Interactive Maps Service using Leaflet (open-source alternative to Google Maps)
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from './auth'

class MapsService {
  constructor() {
    this.markers = []
    this.map = null
  }

  // Initialize map
  initializeMap(containerId, options = {}) {
    const defaultOptions = {
      center: [0, 0],
      zoom: 2,
      ...options,
    }

    // This would use Leaflet or Mapbox in production
    // For now, return a map configuration object
    return {
      center: defaultOptions.center,
      zoom: defaultOptions.zoom,
      markers: [],
    }
  }

  // Add marker to map
  addMarker(lat, lng, data = {}) {
    const marker = {
      id: `marker_${Date.now()}`,
      position: { lat, lng },
      title: data.title || 'Location',
      description: data.description || '',
      type: data.type || 'default', // visited, planned, favorite, poi
      icon: this.getMarkerIcon(data.type),
      ...data,
    }

    this.markers.push(marker)
    return marker
  }

  // Get marker icon based on type
  getMarkerIcon(type) {
    const icons = {
      visited: '✅',
      planned: '📍',
      favorite: '⭐',
      poi: '🏛️',
      hotel: '🏨',
      restaurant: '🍽️',
      activity: '🎭',
      flight: '✈️',
      default: '📍',
    }
    return icons[type] || icons.default
  }

  // Calculate route between points
  async calculateRoute(origin, destination, waypoints = []) {
    try {
      // In production, use Mapbox Directions API or similar
      const route = {
        distance: this.calculateDistance(origin, destination),
        duration: 0, // Would be calculated by routing API
        steps: [],
        waypoints: [origin, ...waypoints, destination],
      }

      return { success: true, route }
    } catch (error) {
      console.error('Error calculating route:', error)
      return { success: false, error: error.message }
    }
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(point1, point2) {
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat)
    const dLon = this.toRad(point2.lng - point1.lng)
    const lat1 = this.toRad(point1.lat)
    const lat2 = this.toRad(point2.lat)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return Math.round(distance * 10) / 10 // Round to 1 decimal
  }

  toRad(value) {
    return (value * Math.PI) / 180
  }

  // Get user's visited locations
  async getVisitedLocations(userId) {
    try {
      const locationsRef = collection(db, 'users', userId, 'locations')
      const q = query(locationsRef, where('status', '==', 'visited'))
      const snapshot = await getDocs(q)

      const locations = []
      snapshot.forEach((doc) => {
        locations.push({
          id: doc.id,
          ...doc.data(),
        })
      })

      return { success: true, locations }
    } catch (error) {
      console.error('Error getting visited locations:', error)
      return { success: false, locations: [] }
    }
  }

  // Save location
  async saveLocation(userId, location) {
    try {
      const locationsRef = collection(db, 'users', userId, 'locations')
      const docRef = await addDoc(locationsRef, {
        ...location,
        savedAt: new Date().toISOString(),
      })

      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error saving location:', error)
      return { success: false, error: error.message }
    }
  }

  // Get heat map data (popular destinations)
  async getHeatMapData() {
    try {
      // In production, aggregate from all users' visited locations
      return {
        success: true,
        heatmap: [
          { lat: 48.8566, lng: 2.3522, intensity: 95 }, // Paris
          { lat: 40.7128, lng: -74.006, intensity: 88 }, // NYC
          { lat: 35.6762, lng: 139.6503, intensity: 92 }, // Tokyo
          { lat: 51.5074, lng: -0.1278, intensity: 85 }, // London
          { lat: -8.4095, lng: 115.1889, intensity: 78 }, // Bali
        ],
      }
    } catch (error) {
      console.error('Error getting heatmap data:', error)
      return { success: false, heatmap: [] }
    }
  }

  // Geocode address to coordinates
  async geocodeAddress(address) {
    try {
      // In production, use Mapbox Geocoding API or similar
      // Mock response for demo
      const mockGeocode = {
        'Paris': { lat: 48.8566, lng: 2.3522 },
        'New York': { lat: 40.7128, lng: -74.006 },
        'Tokyo': { lat: 35.6762, lng: 139.6503 },
        'London': { lat: 51.5074, lng: -0.1278 },
        'Bali': { lat: -8.4095, lng: 115.1889 },
      }

      const coords = mockGeocode[address] || { lat: 0, lng: 0 }
      return { success: true, coordinates: coords }
    } catch (error) {
      console.error('Error geocoding address:', error)
      return { success: false, error: error.message }
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(lat, lng) {
    try {
      // In production, use reverse geocoding API
      return {
        success: true,
        address: 'Sample Address',
        city: 'Sample City',
        country: 'Sample Country',
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      return { success: false, error: error.message }
    }
  }

  // Get nearby places
  async getNearbyPlaces(lat, lng, type = 'all', radius = 5000) {
    try {
      // In production, use Places API
      const places = [
        {
          id: '1',
          name: 'Famous Restaurant',
          type: 'restaurant',
          rating: 4.5,
          distance: 0.5,
          position: { lat: lat + 0.001, lng: lng + 0.001 },
        },
        {
          id: '2',
          name: 'Historic Museum',
          type: 'museum',
          rating: 4.8,
          distance: 1.2,
          position: { lat: lat + 0.002, lng: lng - 0.001 },
        },
        {
          id: '3',
          name: 'City Park',
          type: 'park',
          rating: 4.6,
          distance: 0.8,
          position: { lat: lat - 0.001, lng: lng + 0.002 },
        },
      ]

      return { success: true, places }
    } catch (error) {
      console.error('Error getting nearby places:', error)
      return { success: false, places: [] }
    }
  }

  // Create custom itinerary route
  createItineraryRoute(locations) {
    const route = {
      waypoints: locations.map((loc) => ({
        lat: loc.latitude,
        lng: loc.longitude,
        name: loc.name,
        duration: loc.duration || 60, // minutes
      })),
      totalDistance: 0,
      totalDuration: 0,
    }

    // Calculate total distance and duration
    for (let i = 0; i < route.waypoints.length - 1; i++) {
      const distance = this.calculateDistance(
        route.waypoints[i],
        route.waypoints[i + 1]
      )
      route.totalDistance += distance
      route.totalDuration += route.waypoints[i].duration
    }

    return route
  }

  // Get travel statistics map data
  getUserTravelStats(visitedLocations) {
    const stats = {
      countries: new Set(),
      cities: new Set(),
      continents: new Set(),
      totalDistance: 0,
      coordinates: [],
    }

    visitedLocations.forEach((location) => {
      stats.countries.add(location.country)
      stats.cities.add(location.city)
      stats.continents.add(location.continent)
      stats.coordinates.push({
        lat: location.latitude,
        lng: location.longitude,
        name: location.name,
      })
    })

    return {
      countriesCount: stats.countries.size,
      citiesCount: stats.cities.size,
      continentsCount: stats.continents.size,
      totalDistance: stats.totalDistance,
      coordinates: stats.coordinates,
    }
  }
}

export const mapsService = new MapsService()
export default mapsService
