// Machine Learning Service using TensorFlow.js
import * as tf from '@tensorflow/tfjs'

class MLTravelService {
  constructor() {
    this.model = null
    this.isModelLoaded = false
    this.preferenceModel = null
    this.imageModel = null
  }

  // Initialize TensorFlow
  async initialize() {
    try {
      await tf.ready()
      console.log('TensorFlow.js initialized')
      console.log('Backend:', tf.getBackend())
      return { success: true }
    } catch (error) {
      console.error('Error initializing TensorFlow:', error)
      return { success: false, error: error.message }
    }
  }

  // Load pre-trained model for destination recommendations
  async loadRecommendationModel() {
    try {
      // In production, load from your server or CDN
      // this.model = await tf.loadLayersModel('/models/recommendation/model.json')
      
      // For now, create a simple model
      this.model = this.createRecommendationModel()
      this.isModelLoaded = true
      console.log('Recommendation model loaded')
      return { success: true }
    } catch (error) {
      console.error('Error loading model:', error)
      return { success: false, error: error.message }
    }
  }

  // Create a simple neural network for recommendations
  createRecommendationModel() {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 5, activation: 'softmax' }), // 5 destination categories
      ],
    })

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })

    return model
  }

  // Predict user preferences
  async predictUserPreferences(userData) {
    try {
      if (!this.isModelLoaded) {
        await this.loadRecommendationModel()
      }

      // Convert user data to tensor
      const inputTensor = this.preprocessUserData(userData)

      // Make prediction
      const prediction = this.model.predict(inputTensor)
      const predictions = await prediction.array()

      // Cleanup
      inputTensor.dispose()
      prediction.dispose()

      // Convert predictions to categories
      const categories = [
        'Beach & Relaxation',
        'Adventure & Nature',
        'Cultural & Historical',
        'Urban & Modern',
        'Wellness & Spa',
      ]

      const results = predictions[0].map((score, index) => ({
        category: categories[index],
        score: (score * 100).toFixed(2),
      }))

      // Sort by score
      results.sort((a, b) => b.score - a.score)

      return {
        success: true,
        preferences: results,
        topCategory: results[0].category,
      }
    } catch (error) {
      console.error('Error predicting preferences:', error)
      return { success: false, error: error.message }
    }
  }

  // Preprocess user data for model
  preprocessUserData(userData) {
    const {
      age = 30,
      budget = 3000,
      previousTrips = 0,
      travelStyle = 'moderate', // conservative, moderate, adventurous
      seasonPreference = 'summer', // spring, summer, fall, winter
      groupSize = 2,
      domesticVsInternational = 0.5, // 0-1 scale
      luxuryVsBudget = 0.5, // 0-1 scale
      activityLevel = 0.5, // 0-1 scale
      culturalInterest = 0.5, // 0-1 scale
    } = userData

    // Normalize values to 0-1 range
    const normalized = [
      age / 100,
      Math.min(budget / 10000, 1),
      Math.min(previousTrips / 50, 1),
      travelStyle === 'conservative' ? 0 : travelStyle === 'moderate' ? 0.5 : 1,
      ['spring', 'summer', 'fall', 'winter'].indexOf(seasonPreference) / 3,
      Math.min(groupSize / 10, 1),
      domesticVsInternational,
      luxuryVsBudget,
      activityLevel,
      culturalInterest,
    ]

    return tf.tensor2d([normalized])
  }

  // Predict optimal travel dates
  async predictBestTravelDates(destination, userPreferences) {
    // Simulate ML prediction with historical data analysis
    const weatherPatterns = {
      'tropical': { best: [11, 0, 1, 2, 3], avoid: [6, 7, 8] },
      'temperate': { best: [4, 5, 8, 9], avoid: [0, 1, 11] },
      'cold': { best: [5, 6, 7], avoid: [11, 0, 1, 2] },
      'desert': { best: [10, 11, 0, 1, 2], avoid: [5, 6, 7, 8] },
    }

    const pricePatterns = {
      'peak': [5, 6, 7, 11, 0],
      'shoulder': [3, 4, 9, 10],
      'offseason': [1, 2, 8],
    }

    const currentMonth = new Date().getMonth()
    
    // Simple prediction based on patterns
    const recommendations = []
    for (let month = 0; month < 12; month++) {
      const score = this.calculateMonthScore(
        month,
        destination,
        weatherPatterns,
        pricePatterns,
        userPreferences
      )
      
      recommendations.push({
        month: new Date(2026, month, 1).toLocaleDateString('es', { month: 'long' }),
        score: score,
        priceLevel: pricePatterns.peak.includes(month) ? 'Alto' : 
                    pricePatterns.shoulder.includes(month) ? 'Medio' : 'Bajo',
        crowdLevel: pricePatterns.peak.includes(month) ? 'Alto' : 
                     pricePatterns.shoulder.includes(month) ? 'Medio' : 'Bajo',
      })
    }

    recommendations.sort((a, b) => b.score - a.score)

    return {
      success: true,
      recommendations: recommendations.slice(0, 3),
    }
  }

  calculateMonthScore(month, destination, weatherPatterns, pricePatterns, prefs) {
    let score = 50 // Base score

    // Weather score
    const climateType = destination.climate || 'temperate'
    if (weatherPatterns[climateType]?.best.includes(month)) score += 30
    if (weatherPatterns[climateType]?.avoid.includes(month)) score -= 20

    // Price preference
    if (prefs?.budgetPriority && pricePatterns.offseason.includes(month)) score += 20
    if (!prefs?.budgetPriority && pricePatterns.peak.includes(month)) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  // Image recognition for destination identification
  async identifyDestination(imageElement) {
    try {
      // Load MobileNet model for image classification
      if (!this.imageModel) {
        this.imageModel = await tf.loadLayersModel(
          'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1',
          { fromTFHub: true }
        )
      }

      // Preprocess image
      const tensor = tf.browser
        .fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims()

      // Make prediction
      const predictions = await this.imageModel.predict(tensor).data()

      // Cleanup
      tensor.dispose()

      // Map to travel destinations (simplified)
      const topPredictions = Array.from(predictions)
        .map((score, index) => ({ score, index }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)

      return {
        success: true,
        predictions: topPredictions,
      }
    } catch (error) {
      console.error('Error identifying destination:', error)
      return { success: false, error: error.message }
    }
  }

  // Predict trip cost using regression
  async predictTripCost(tripDetails) {
    const {
      destination,
      duration = 7,
      travelers = 2,
      accommodation = 'hotel',
      season = 'summer',
    } = tripDetails

    // Feature engineering
    const features = [
      duration / 30, // Normalized duration
      travelers / 10, // Normalized travelers
      accommodation === 'luxury' ? 1 : accommodation === 'budget' ? 0 : 0.5,
      ['winter', 'spring', 'summer', 'fall'].indexOf(season) / 3,
    ]

    // Simple linear regression (in production, use trained model)
    const weights = [500, 300, 1000, 200] // Cost per feature
    const bias = 800 // Base cost

    const predictedCost = features.reduce(
      (sum, feature, i) => sum + feature * weights[i],
      bias
    )

    // Add variance for realism
    const variance = predictedCost * 0.15
    const low = Math.round(predictedCost - variance)
    const high = Math.round(predictedCost + variance)

    return {
      success: true,
      estimatedCost: Math.round(predictedCost),
      range: { low, high },
      confidence: 0.85,
      breakdown: {
        accommodation: Math.round(predictedCost * 0.4),
        food: Math.round(predictedCost * 0.25),
        activities: Math.round(predictedCost * 0.2),
        transportation: Math.round(predictedCost * 0.15),
      },
    }
  }

  // Sentiment analysis of reviews
  async analyzeSentiment(reviews) {
    // Simplified sentiment analysis
    const positiveWords = [
      'amazing', 'beautiful', 'perfect', 'excellent', 'wonderful',
      'great', 'fantastic', 'love', 'best', 'incredible',
    ]
    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'disappointing',
      'poor', 'worst', 'avoid', 'waste', 'dirty',
    ]

    const results = reviews.map((review) => {
      const text = review.toLowerCase()
      const positiveCount = positiveWords.filter((word) => text.includes(word)).length
      const negativeCount = negativeWords.filter((word) => text.includes(word)).length

      const score = (positiveCount - negativeCount) / (positiveCount + negativeCount + 1)
      const sentiment = score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral'

      return {
        text: review,
        sentiment,
        score: ((score + 1) / 2 * 100).toFixed(0), // 0-100 scale
      }
    })

    const averageScore = results.reduce((sum, r) => sum + parseFloat(r.score), 0) / results.length

    return {
      success: true,
      results,
      averageScore: averageScore.toFixed(1),
      overallSentiment: averageScore > 60 ? 'positive' : averageScore < 40 ? 'negative' : 'neutral',
    }
  }

  // Anomaly detection for prices
  async detectPriceAnomalies(prices) {
    const tensor = tf.tensor1d(prices)
    const mean = tensor.mean()
    const std = tf.moments(tensor).variance.sqrt()

    const zScores = tensor.sub(mean).div(std)
    const anomalies = await zScores.greater(2).array() // Z-score > 2

    tensor.dispose()
    zScores.dispose()

    const results = prices.map((price, index) => ({
      price,
      isAnomaly: anomalies[index],
      deviation: Math.abs(price - (await mean.array())),
    }))

    return {
      success: true,
      anomalies: results.filter((r) => r.isAnomaly),
      avgPrice: await mean.array(),
    }
  }

  // Cleanup
  dispose() {
    if (this.model) {
      this.model.dispose()
    }
    if (this.imageModel) {
      this.imageModel.dispose()
    }
  }
}

export const mlService = new MLTravelService()
export default mlService
