// Voice Assistant Service using Web Speech API
class VoiceAssistantService {
  constructor() {
    this.recognition = null
    this.synthesis = window.speechSynthesis
    this.isListening = false
    this.voices = []
    this.currentLanguage = 'es-ES'
  }

  // Initialize speech recognition
  initialize() {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        return { success: false, error: 'Speech recognition not supported' }
      }

      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = true
      this.recognition.lang = this.currentLanguage

      // Load available voices
      this.loadVoices()

      return { success: true }
    } catch (error) {
      console.error('Error initializing voice assistant:', error)
      return { success: false, error: error.message }
    }
  }

  // Load available voices for text-to-speech
  loadVoices() {
    this.voices = this.synthesis.getVoices()

    if (this.voices.length === 0) {
      // Voices might load asynchronously
      this.synthesis.onvoiceschanged = () => {
        this.voices = this.synthesis.getVoices()
      }
    }
  }

  // Start listening
  async startListening(onResult, onEnd) {
    if (!this.recognition) {
      const initResult = this.initialize()
      if (!initResult.success) {
        return initResult
      }
    }

    try {
      this.isListening = true

      this.recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('')

        const isFinal = event.results[event.results.length - 1].isFinal

        if (onResult) {
          onResult({
            transcript,
            isFinal,
            confidence: event.results[0][0].confidence,
          })
        }

        if (isFinal) {
          this.processCommand(transcript)
        }
      }

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        this.isListening = false
      }

      this.recognition.onend = () => {
        this.isListening = false
        if (onEnd) onEnd()
      }

      this.recognition.start()

      return { success: true, message: 'Listening...' }
    } catch (error) {
      console.error('Error starting recognition:', error)
      this.isListening = false
      return { success: false, error: error.message }
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  // Process voice commands
  async processCommand(command) {
    const lowerCommand = command.toLowerCase()

    // Command patterns
    const commands = {
      search: /busca|buscar|encuentra|encontrar (.*)/i,
      navigate: /ve a|ir a|navega a (.*)/i,
      book: /reserva|reservar (.*)/i,
      weather: /clima|tiempo en (.*)/i,
      translate: /traduce|traducir (.*)/i,
      help: /ayuda|help|qué puedes hacer/i,
      price: /precio|cuánto cuesta (.*)/i,
      flight: /vuelo|vuelos? (a|para) (.*)/i,
      hotel: /hotel|hoteles? en (.*)/i,
    }

    let response = ''

    if (commands.help.test(lowerCommand)) {
      response = this.getHelpMessage()
    } else if (commands.search.test(lowerCommand)) {
      const match = lowerCommand.match(commands.search)
      response = await this.handleSearch(match[1])
    } else if (commands.navigate.test(lowerCommand)) {
      const match = lowerCommand.match(commands.navigate)
      response = this.handleNavigation(match[1])
    } else if (commands.weather.test(lowerCommand)) {
      const match = lowerCommand.match(commands.weather)
      response = await this.handleWeather(match[1])
    } else if (commands.flight.test(lowerCommand)) {
      const match = lowerCommand.match(commands.flight)
      response = await this.handleFlight(match[2])
    } else if (commands.hotel.test(lowerCommand)) {
      const match = lowerCommand.match(commands.hotel)
      response = await this.handleHotel(match[1])
    } else {
      response = 'No entendí el comando. Di "ayuda" para ver qué puedo hacer.'
    }

    // Speak response
    this.speak(response)

    return {
      command: lowerCommand,
      response,
    }
  }

  // Text-to-speech
  speak(text, options = {}) {
    const {
      lang = this.currentLanguage,
      rate = 1.0,
      pitch = 1.0,
      volume = 1.0,
    } = options

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume

    // Select appropriate voice
    const voice = this.voices.find((v) => v.lang.startsWith(lang.split('-')[0]))
    if (voice) {
      utterance.voice = voice
    }

    this.synthesis.speak(utterance)

    return new Promise((resolve) => {
      utterance.onend = () => resolve({ success: true })
      utterance.onerror = () => resolve({ success: false })
    })
  }

  // Stop speaking
  stopSpeaking() {
    this.synthesis.cancel()
  }

  // Command handlers
  getHelpMessage() {
    return `Puedo ayudarte con:
      - Buscar destinos: "Busca playas en el Caribe"
      - Navegar: "Ve a mis viajes"
      - Ver clima: "Clima en París"
      - Buscar vuelos: "Vuelos a Nueva York"
      - Buscar hoteles: "Hoteles en Tokio"
      - Traducir: "Traduce gracias al francés"
      ¿Qué necesitas?`
  }

  async handleSearch(query) {
    // Trigger search in app
    window.dispatchEvent(
      new CustomEvent('voiceSearch', { detail: { query } })
    )
    return `Buscando ${query}...`
  }

  handleNavigation(page) {
    const routes = {
      inicio: '/',
      home: '/',
      descubrir: '/discover',
      'bucket list': '/bucket-list',
      'mis viajes': '/my-trips',
      viajes: '/my-trips',
      galería: '/gallery',
      fotos: '/gallery',
      perfil: '/profile',
      chat: '/chat',
    }

    const route = routes[page.toLowerCase()]

    if (route) {
      window.dispatchEvent(
        new CustomEvent('voiceNavigate', { detail: { route } })
      )
      return `Navegando a ${page}`
    }

    return `No encontré la página ${page}`
  }

  async handleWeather(location) {
    // This would call the weather API
    return `Consultando el clima en ${location}...`
  }

  async handleFlight(destination) {
    window.dispatchEvent(
      new CustomEvent('voiceFlightSearch', { detail: { destination } })
    )
    return `Buscando vuelos a ${destination}...`
  }

  async handleHotel(location) {
    window.dispatchEvent(
      new CustomEvent('voiceHotelSearch', { detail: { location } })
    )
    return `Buscando hoteles en ${location}...`
  }

  // Multi-language support
  async translate(text, targetLang) {
    // In production, use translation API
    const translations = {
      'gracias': { en: 'thank you', fr: 'merci', de: 'danke', it: 'grazie' },
      'hola': { en: 'hello', fr: 'bonjour', de: 'hallo', it: 'ciao' },
      'adiós': { en: 'goodbye', fr: 'au revoir', de: 'auf wiedersehen', it: 'arrivederci' },
    }

    const translation = translations[text.toLowerCase()]?.[targetLang]

    if (translation) {
      return { success: true, translation }
    }

    return { success: false, error: 'Translation not available' }
  }

  // Change language
  setLanguage(lang) {
    this.currentLanguage = lang
    if (this.recognition) {
      this.recognition.lang = lang
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return [
      { code: 'es-ES', name: 'Español' },
      { code: 'en-US', name: 'English' },
      { code: 'fr-FR', name: 'Français' },
      { code: 'de-DE', name: 'Deutsch' },
      { code: 'it-IT', name: 'Italiano' },
      { code: 'pt-BR', name: 'Português' },
      { code: 'ja-JP', name: '日本語' },
      { code: 'zh-CN', name: '中文' },
    ]
  }

  // Wake word detection (simplified)
  enableWakeWord(wakeWord = 'voyager') {
    this.wakeWord = wakeWord.toLowerCase()

    const checkWakeWord = (transcript) => {
      if (transcript.toLowerCase().includes(this.wakeWord)) {
        this.speak('Sí, dime')
        return true
      }
      return false
    }

    return checkWakeWord
  }

  // Check if speech is supported
  isSupported() {
    return (
      'SpeechRecognition' in window ||
      'webkitSpeechRecognition' in window
    ) && 'speechSynthesis' in window
  }
}

export const voiceAssistant = new VoiceAssistantService()
export default voiceAssistant

// React Hook for Voice Assistant
import { useState, useEffect, useCallback } from 'react'

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported(voiceAssistant.isSupported())
    voiceAssistant.initialize()
  }, [])

  const startListening = useCallback(() => {
    voiceAssistant.startListening(
      (result) => {
        setTranscript(result.transcript)
        if (result.isFinal) {
          setIsListening(false)
        }
      },
      () => {
        setIsListening(false)
      }
    )
    setIsListening(true)
  }, [])

  const stopListening = useCallback(() => {
    voiceAssistant.stopListening()
    setIsListening(false)
  }, [])

  const speak = useCallback((text, options) => {
    return voiceAssistant.speak(text, options)
  }, [])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
  }
}
