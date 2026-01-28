// AI Recommendations Service - Intelligent travel suggestions
const CLAUDE_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

class AIRecommendationsService {
  // Get personalized recommendations based on user preferences
  async getPersonalizedRecommendations(userData) {
    try {
      // In production, this would call Claude API
      // For now, return intelligent mock data based on user preferences
      return this.generateSmartRecommendations(userData)
    } catch (error) {
      console.error('Error getting AI recommendations:', error)
      return this.getFallbackRecommendations()
    }
  }

  // Generate smart recommendations
  generateSmartRecommendations(userData) {
    const { interests = [], budget, travelStyle, previousDestinations = [] } = userData

    const allRecommendations = [
      {
        destination: 'Kyoto, Japan',
        matchScore: 95,
        reason: 'Perfect blend of culture, history, and nature',
        highlights: ['Historic Temples', 'Cherry Blossoms', 'Tea Ceremony'],
        budget: { total: 1700 },
        bestTime: 'March-April, October-November',
        interests: ['culture', 'history', 'photography'],
      },
      {
        destination: 'Santorini, Greece',
        matchScore: 92,
        reason: 'Romantic island paradise with stunning views',
        highlights: ['Sunset Views', 'White Architecture', 'Beach Relaxation'],
        budget: { total: 2200 },
        bestTime: 'May-September',
        interests: ['beach', 'romance', 'photography'],
      },
      {
        destination: 'Patagonia, Argentina',
        matchScore: 88,
        reason: 'Ultimate adventure destination for nature lovers',
        highlights: ['Glacier Hiking', 'Mountain Trekking', 'Wildlife'],
        budget: { total: 2800 },
        bestTime: 'November-March',
        interests: ['adventure', 'nature', 'hiking'],
      },
    ]

    // Filter and score based on user interests
    const scored = allRecommendations.map((rec) => {
      let score = rec.matchScore
      const matchingInterests = rec.interests.filter((i) =>
        interests.some((userInt) => userInt.toLowerCase().includes(i))
      )
      score += matchingInterests.length * 5

      if (budget && rec.budget.total <= budget) score += 10

      return { ...rec, matchScore: Math.min(score, 100) }
    })

    return {
      success: true,
      recommendations: scored.sort((a, b) => b.matchScore - a.matchScore),
    }
  }

  // Fallback recommendations
  getFallbackRecommendations() {
    return {
      success: true,
      recommendations: [
        {
          destination: 'Barcelona, Spain',
          matchScore: 90,
          reason: 'Vibrant city with art, culture, and beaches',
          highlights: ['Sagrada Familia', 'Gothic Quarter', 'La Rambla'],
          budget: { total: 1800 },
          bestTime: 'May-June, September-October',
        },
      ],
    }
  }
}

export const aiRecommendations = new AIRecommendationsService()
export default aiRecommendations
