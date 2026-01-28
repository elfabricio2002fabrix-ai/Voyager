// Social Sharing Service
export const socialService = {
  // Share on Facebook
  shareOnFacebook(url, quote = '') {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(quote)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  },

  // Share on Twitter/X
  shareOnTwitter(text, url = '') {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  },

  // Share on WhatsApp
  shareOnWhatsApp(text) {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(shareUrl, '_blank')
  },

  // Share on Instagram (opens Instagram app)
  shareOnInstagram() {
    // Instagram doesn't support web sharing directly
    // This would typically open the app or prompt to download
    alert('Abre Instagram y comparte manualmente. ¡Etiquétanos @voyagertravel!')
  },

  // Share via Email
  shareViaEmail(subject, body) {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  },

  // Copy link to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      return { success: true, message: 'Link copiado al portapapeles' }
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      return { success: false, error: 'No se pudo copiar el link' }
    }
  },

  // Share using Web Share API (mobile native share)
  async nativeShare(data) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title || 'Voyager',
          text: data.text || '',
          url: data.url || window.location.href,
        })
        return { success: true }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error)
          return { success: false, error: error.message }
        }
        return { success: false, error: 'Share cancelled' }
      }
    }
    return { success: false, error: 'Web Share API not supported' }
  },

  // Generate shareable itinerary link
  generateItineraryLink(itineraryId) {
    return `${window.location.origin}/itinerary/${itineraryId}`
  },

  // Format itinerary for sharing
  formatItineraryForSharing(itinerary) {
    const { destination, startDate, endDate, highlights } = itinerary
    return `🌍 ¡Mira mi itinerario para ${destination}! 
    
📅 ${startDate} - ${endDate}
    
✨ Highlights:
${highlights.map((h) => `• ${h}`).join('\n')}
    
Planifica tu viaje con Voyager 🚀`
  },
}

// Itinerary Service
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { db } from './auth'

export const itineraryService = {
  // Create new itinerary
  async createItinerary(userId, itineraryData) {
    try {
      const docRef = await addDoc(collection(db, 'itineraries'), {
        userId,
        ...itineraryData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shared: false,
        views: 0,
        likes: 0,
      })

      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating itinerary:', error)
      return { success: false, error: error.message }
    }
  },

  // Get itinerary by ID
  async getItinerary(itineraryId) {
    try {
      const docRef = doc(db, 'itineraries', itineraryId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        // Increment view count
        await updateDoc(docRef, {
          views: (docSnap.data().views || 0) + 1,
        })

        return {
          success: true,
          itinerary: { id: docSnap.id, ...docSnap.data() },
        }
      }

      return { success: false, error: 'Itinerary not found' }
    } catch (error) {
      console.error('Error getting itinerary:', error)
      return { success: false, error: error.message }
    }
  },

  // Get user's itineraries
  async getUserItineraries(userId) {
    try {
      const q = query(collection(db, 'itineraries'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)

      const itineraries = []
      querySnapshot.forEach((doc) => {
        itineraries.push({ id: doc.id, ...doc.data() })
      })

      return { success: true, itineraries }
    } catch (error) {
      console.error('Error getting user itineraries:', error)
      return { success: false, itineraries: [] }
    }
  },

  // Update itinerary
  async updateItinerary(itineraryId, updates) {
    try {
      const docRef = doc(db, 'itineraries', itineraryId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      })

      return { success: true }
    } catch (error) {
      console.error('Error updating itinerary:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete itinerary
  async deleteItinerary(itineraryId) {
    try {
      await deleteDoc(doc(db, 'itineraries', itineraryId))
      return { success: true }
    } catch (error) {
      console.error('Error deleting itinerary:', error)
      return { success: false, error: error.message }
    }
  },

  // Share itinerary (make public)
  async shareItinerary(itineraryId) {
    try {
      const docRef = doc(db, 'itineraries', itineraryId)
      await updateDoc(docRef, {
        shared: true,
        sharedAt: new Date().toISOString(),
      })

      const shareLink = socialService.generateItineraryLink(itineraryId)
      return { success: true, shareLink }
    } catch (error) {
      console.error('Error sharing itinerary:', error)
      return { success: false, error: error.message }
    }
  },

  // Like itinerary
  async likeItinerary(itineraryId, userId) {
    try {
      const docRef = doc(db, 'itineraries', itineraryId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const likes = docSnap.data().likes || 0
        const likedBy = docSnap.data().likedBy || []

        if (!likedBy.includes(userId)) {
          await updateDoc(docRef, {
            likes: likes + 1,
            likedBy: [...likedBy, userId],
          })
        }

        return { success: true }
      }

      return { success: false, error: 'Itinerary not found' }
    } catch (error) {
      console.error('Error liking itinerary:', error)
      return { success: false, error: error.message }
    }
  },

  // Get public itineraries (discover)
  async getPublicItineraries(limit = 20) {
    try {
      const q = query(
        collection(db, 'itineraries'),
        where('shared', '==', true),
        limit(limit)
      )
      const querySnapshot = await getDocs(q)

      const itineraries = []
      querySnapshot.forEach((doc) => {
        itineraries.push({ id: doc.id, ...doc.data() })
      })

      return { success: true, itineraries }
    } catch (error) {
      console.error('Error getting public itineraries:', error)
      return { success: false, itineraries: [] }
    }
  },

  // Duplicate itinerary
  async duplicateItinerary(itineraryId, userId) {
    try {
      const result = await this.getItinerary(itineraryId)
      if (!result.success) return result

      const { id, userId: originalUserId, ...itineraryData } = result.itinerary

      return await this.createItinerary(userId, {
        ...itineraryData,
        title: `${itineraryData.title} (Copia)`,
        shared: false,
        views: 0,
        likes: 0,
      })
    } catch (error) {
      console.error('Error duplicating itinerary:', error)
      return { success: false, error: error.message }
    }
  },
}

export default { socialService, itineraryService }
