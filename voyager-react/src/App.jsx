import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import Discover from './pages/Discover'
import BucketList from './pages/BucketList'
import MyTrips from './pages/MyTrips'
import Gallery from './pages/Gallery'
import Profile from './pages/Profile'
import Notification from './components/Notification'
import BookingModal from './components/BookingModal'

function App() {
  const [notification, setNotification] = useState({ show: false, message: '' })
  const [bookingModal, setBookingModal] = useState({ show: false, destination: '' })

  const showNotification = (message) => {
    setNotification({ show: true, message })
    setTimeout(() => {
      setNotification({ show: false, message: '' })
    }, 3000)
  }

  const showBookingModal = (destination) => {
    setBookingModal({ show: true, destination })
  }

  const closeBookingModal = () => {
    setBookingModal({ show: false, destination: '' })
  }

  const confirmBooking = () => {
    showNotification('¡Reserva confirmada! Te hemos enviado un email con los detalles.')
    closeBookingModal()
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home showBookingModal={showBookingModal} />} />
            <Route path="/discover" element={<Discover showBookingModal={showBookingModal} />} />
            <Route path="/bucket-list" element={<BucketList />} />
            <Route path="/my-trips" element={<MyTrips />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <Notification 
          show={notification.show} 
          message={notification.message} 
        />

        <BookingModal 
          show={bookingModal.show}
          destination={bookingModal.destination}
          onClose={closeBookingModal}
          onConfirm={confirmBooking}
        />
      </div>
    </Router>
  )
}

export default App
