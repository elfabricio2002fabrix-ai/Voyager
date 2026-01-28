import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  limit,
} from 'firebase/firestore'
import { db } from './auth'

class ChatService {
  constructor() {
    this.listeners = new Map()
  }

  // Create or get chat room
  async getChatRoom(user1Id, user2Id) {
    try {
      // Check if room exists
      const roomsRef = collection(db, 'chatRooms')
      const q = query(
        roomsRef,
        where('participants', 'array-contains', user1Id)
      )

      const snapshot = await getDocs(q)
      let roomId = null

      snapshot.forEach((doc) => {
        const data = doc.data()
        if (data.participants.includes(user2Id)) {
          roomId = doc.id
        }
      })

      // Create new room if doesn't exist
      if (!roomId) {
        const docRef = await addDoc(collection(db, 'chatRooms'), {
          participants: [user1Id, user2Id],
          createdAt: serverTimestamp(),
          lastMessage: null,
          lastMessageTime: null,
        })
        roomId = docRef.id
      }

      return { success: true, roomId }
    } catch (error) {
      console.error('Error getting chat room:', error)
      return { success: false, error: error.message }
    }
  }

  // Send message
  async sendMessage(roomId, senderId, senderName, text, type = 'text', metadata = {}) {
    try {
      await addDoc(collection(db, 'chatRooms', roomId, 'messages'), {
        senderId,
        senderName,
        text,
        type, // 'text', 'image', 'location', 'itinerary'
        metadata,
        timestamp: serverTimestamp(),
        read: false,
      })

      // Update last message in room
      await updateDoc(doc(db, 'chatRooms', roomId), {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
      })

      return { success: true }
    } catch (error) {
      console.error('Error sending message:', error)
      return { success: false, error: error.message }
    }
  }

  // Listen to messages in real-time
  subscribeToMessages(roomId, callback) {
    const messagesRef = collection(db, 'chatRooms', roomId, 'messages')
    const q = query(messagesRef, orderBy('timestamp', 'asc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = []
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
        })
      })
      callback(messages)
    })

    this.listeners.set(roomId, unsubscribe)
    return unsubscribe
  }

  // Get user chat rooms
  async getUserChatRooms(userId) {
    try {
      const roomsRef = collection(db, 'chatRooms')
      const q = query(
        roomsRef,
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      )

      const snapshot = await getDocs(q)
      const rooms = []

      snapshot.forEach((doc) => {
        rooms.push({
          id: doc.id,
          ...doc.data(),
          lastMessageTime: doc.data().lastMessageTime?.toDate(),
        })
      })

      return { success: true, rooms }
    } catch (error) {
      console.error('Error getting user chat rooms:', error)
      return { success: false, error: error.message, rooms: [] }
    }
  }

  // Mark messages as read
  async markAsRead(roomId, userId) {
    try {
      const messagesRef = collection(db, 'chatRooms', roomId, 'messages')
      const q = query(
        messagesRef,
        where('senderId', '!=', userId),
        where('read', '==', false)
      )

      const snapshot = await getDocs(q)
      const updates = []

      snapshot.forEach((doc) => {
        updates.push(updateDoc(doc.ref, { read: true }))
      })

      await Promise.all(updates)
      return { success: true }
    } catch (error) {
      console.error('Error marking messages as read:', error)
      return { success: false, error: error.message }
    }
  }

  // Send typing indicator
  async sendTypingIndicator(roomId, userId, isTyping) {
    try {
      await updateDoc(doc(db, 'chatRooms', roomId), {
        [`typing_${userId}`]: isTyping,
      })
      return { success: true }
    } catch (error) {
      console.error('Error sending typing indicator:', error)
      return { success: false }
    }
  }

  // Share itinerary in chat
  async shareItinerary(roomId, senderId, senderName, itinerary) {
    return this.sendMessage(
      roomId,
      senderId,
      senderName,
      '📍 Compartió un itinerario',
      'itinerary',
      { itinerary }
    )
  }

  // Share location
  async shareLocation(roomId, senderId, senderName, location) {
    return this.sendMessage(
      roomId,
      senderId,
      senderName,
      '📍 Compartió una ubicación',
      'location',
      { location }
    )
  }

  // Get nearby travelers
  async getNearbyTravelers(latitude, longitude, radiusKm = 50) {
    try {
      // This would use geohashing in production
      // For now, return mock data
      return {
        success: true,
        travelers: [
          {
            id: 'user1',
            name: 'María González',
            photoURL: 'https://i.pravatar.cc/150?img=1',
            distance: 2.5,
            currentLocation: 'París',
            interests: ['Arte', 'Gastronomía'],
            level: 'Explorer',
          },
          {
            id: 'user2',
            name: 'Carlos Ruiz',
            photoURL: 'https://i.pravatar.cc/150?img=2',
            distance: 5.8,
            currentLocation: 'París',
            interests: ['Fotografía', 'Historia'],
            level: 'Adventurer',
          },
        ],
      }
    } catch (error) {
      console.error('Error getting nearby travelers:', error)
      return { success: false, travelers: [] }
    }
  }

  // Unsubscribe from messages
  unsubscribeFromMessages(roomId) {
    const unsubscribe = this.listeners.get(roomId)
    if (unsubscribe) {
      unsubscribe()
      this.listeners.delete(roomId)
    }
  }

  // Cleanup all listeners
  cleanup() {
    this.listeners.forEach((unsubscribe) => unsubscribe())
    this.listeners.clear()
  }
}

export const chatService = new ChatService()
export default chatService
