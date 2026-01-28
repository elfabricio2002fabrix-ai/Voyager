// Travel API Service - Integrates multiple travel APIs
// Amadeus, Skyscanner, Hotels.com, Weather API, etc.

const AMADEUS_API_KEY = import.meta.env.VITE_AMADEUS_API_KEY
const AMADEUS_API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY

class TravelAPIService {
  constructor() {
    this.amadeusToken = null
    this.tokenExpiry = null
  }

  // Get Amadeus Access Token
  async getAmadeusToken() {
    if (this.amadeusToken && this.tokenExpiry > Date.now()) {
      return this.amadeusToken
    }

    try {
      const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: AMADEUS_API_KEY,
          client_secret: AMADEUS_API_SECRET,
        }),
      })

      const data = await response.json()
      this.amadeusToken = data.access_token
      this.tokenExpiry = Date.now() + (data.expires_in * 1000)
      return this.amadeusToken
    } catch (error) {
      console.error('Error getting Amadeus token:', error)
      return null
    }
  }

  // Search Flights
  async searchFlights({ origin, destination, departureDate, returnDate, adults = 1 }) {
    try {
      const token = await this.getAmadeusToken()
      if (!token) throw new Error('Failed to authenticate')

      const params = new URLSearchParams({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        adults: adults.toString(),
        nonStop: 'false',
        max: '10',
      })

      if (returnDate) {
        params.append('returnDate', returnDate)
      }

      const response = await fetch(
        `https://test.api.amadeus.com/v2/shopping/flight-offers?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()
      return {
        success: true,
        flights: data.data || [],
        meta: data.meta,
      }
    } catch (error) {
      console.error('Error searching flights:', error)
      // Return mock data for demo
      return this.getMockFlights(origin, destination)
    }
  }

  // Search Hotels
  async searchHotels({ cityCode, checkInDate, checkOutDate, adults = 2, radius = 5 }) {
    try {
      const token = await this.getAmadeusToken()
      if (!token) throw new Error('Failed to authenticate')

      const params = new URLSearchParams({
        cityCode,
        radius: radius.toString(),
        radiusUnit: 'KM',
        checkInDate,
        checkOutDate,
        adults: adults.toString(),
        ratings: '4,5',
      })

      const response = await fetch(
        `https://test.api.amadeus.com/v3/shopping/hotel-offers?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()
      return {
        success: true,
        hotels: data.data || [],
      }
    } catch (error) {
      console.error('Error searching hotels:', error)
      return this.getMockHotels(cityCode)
    }
  }

  // Get City Information
  async getCityInfo(cityCode) {
    try {
      const token = await this.getAmadeusToken()
      if (!token) throw new Error('Failed to authenticate')

      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations/${cityCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()
      return {
        success: true,
        city: data.data,
      }
    } catch (error) {
      console.error('Error getting city info:', error)
      return { success: false, error: error.message }
    }
  }

  // Get Weather Information
  async getWeather(city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=es`
      )

      const data = await response.json()
      return {
        success: true,
        weather: {
          temp: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
        },
      }
    } catch (error) {
      console.error('Error getting weather:', error)
      return this.getMockWeather()
    }
  }

  // Get Destination Photos
  async getDestinationPhotos(query, count = 10) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&client_id=${UNSPLASH_API_KEY}`
      )

      const data = await response.json()
      return {
        success: true,
        photos: data.results.map(photo => ({
          id: photo.id,
          url: photo.urls.regular,
          thumb: photo.urls.thumb,
          description: photo.description || photo.alt_description,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
        })),
      }
    } catch (error) {
      console.error('Error getting photos:', error)
      return { success: false, photos: [] }
    }
  }

  // Get Points of Interest
  async getPointsOfInterest({ latitude, longitude, radius = 5 }) {
    try {
      const token = await this.getAmadeusToken()
      if (!token) throw new Error('Failed to authenticate')

      const response = await fetch(
        `https://test.api.amadeus.com/v1/reference-data/locations/pois?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()
      return {
        success: true,
        pois: data.data || [],
      }
    } catch (error) {
      console.error('Error getting POIs:', error)
      return this.getMockPOIs()
    }
  }

  // Get Travel Recommendations (AI-powered)
  async getRecommendations({ preferences, budget, interests, travelStyle }) {
    try {
      // In production, this would call an AI service (OpenAI, Claude, etc.)
      // For now, return intelligent mock recommendations
      return {
        success: true,
        recommendations: this.generateAIRecommendations({ preferences, budget, interests, travelStyle }),
      }
    } catch (error) {
      console.error('Error getting recommendations:', error)
      return { success: false, recommendations: [] }
    }
  }

  // Mock Data Functions (fallback when APIs are not available)
  getMockFlights(origin, destination) {
    return {
      success: true,
      flights: [
        {
          id: '1',
          price: { total: '450.00', currency: 'USD' },
          airline: 'Avianca',
          departure: { iataCode: origin, at: '2026-03-15T08:00:00' },
          arrival: { iataCode: destination, at: '2026-03-15T14:30:00' },
          duration: 'PT6H30M',
          stops: 0,
        },
        {
          id: '2',
          price: { total: '520.00', currency: 'USD' },
          airline: 'LATAM',
          departure: { iataCode: origin, at: '2026-03-15T10:30:00' },
          arrival: { iataCode: destination, at: '2026-03-15T18:00:00' },
          duration: 'PT7H30M',
          stops: 1,
        },
      ],
      meta: { count: 2 },
    }
  }

  getMockHotels(cityCode) {
    return {
      success: true,
      hotels: [
        {
          hotel: {
            name: 'Grand Hotel Plaza',
            rating: 5,
            cityCode,
          },
          offers: [
            {
              id: '1',
              price: { total: '280.00', currency: 'USD' },
              room: { type: 'Deluxe Suite', description: 'Luxury room with city view' },
            },
          ],
        },
        {
          hotel: {
            name: 'Central Boutique Hotel',
            rating: 4,
            cityCode,
          },
          offers: [
            {
              id: '2',
              price: { total: '180.00', currency: 'USD' },
              room: { type: 'Standard Room', description: 'Comfortable room in city center' },
            },
          ],
        },
      ],
    }
  }

  getMockWeather() {
    return {
      success: true,
      weather: {
        temp: 22,
        feelsLike: 24,
        description: 'Parcialmente nublado',
        icon: '02d',
        humidity: 65,
        windSpeed: 12,
      },
    }
  }

  getMockPOIs() {
    return {
      success: true,
      pois: [
        {
          id: '1',
          name: 'Historical Museum',
          category: 'SIGHTS',
          rank: 5,
          geoCode: { latitude: 40.7128, longitude: -74.0060 },
        },
        {
          id: '2',
          name: 'Central Park',
          category: 'PARK',
          rank: 5,
          geoCode: { latitude: 40.7829, longitude: -73.9654 },
        },
      ],
    }
  }

  generateAIRecommendations({ preferences, budget, interests, travelStyle }) {
    // Simulate AI-generated recommendations based on user preferences
    const destinations = [
      {
        name: 'Bali, Indonesia',
        score: 95,
        reason: 'Perfect match for your wellness interests and budget',
        highlights: ['Yoga retreats', 'Beach relaxation', 'Cultural temples', 'Affordable luxury'],
        estimatedCost: 2800,
        bestTime: 'April - October',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      },
      {
        name: 'Santorini, Greece',
        score: 88,
        reason: 'Romantic destination with stunning views',
        highlights: ['Sunset views', 'Greek cuisine', 'Historic sites', 'Island hopping'],
        estimatedCost: 3500,
        bestTime: 'May - September',
        image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
      },
      {
        name: 'Tokyo, Japan',
        score: 92,
        reason: 'Perfect blend of tradition and technology',
        highlights: ['Unique culture', 'Amazing food', 'Modern architecture', 'Safe travel'],
        estimatedCost: 3200,
        bestTime: 'March - May, September - November',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      },
    ]

    return destinations
  }
}

export const travelAPI = new TravelAPIService()
export default travelAPI
