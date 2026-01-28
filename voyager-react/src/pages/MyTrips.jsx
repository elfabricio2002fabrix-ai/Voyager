// MyTrips.jsx
import { motion } from 'framer-motion'
import { Plane, Hotel, Users, DollarSign, MoreVertical } from 'lucide-react'

const MyTrips = () => {
  const trips = [
    {
      name: 'París Romántico',
      dates: '15 - 22 Marzo 2026',
      image:
        'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
      status: 'confirmed',
      hotel: 'Hotel Le Marais',
      people: 2,
      total: 3420,
    },
    {
      name: 'Aventura en los Alpes',
      dates: '5 - 12 Julio 2026',
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      status: 'pending',
      hotel: 'Cabaña Alpine',
      people: 4,
      total: 5680,
    },
    {
      name: 'Retiro en Bali',
      dates: '10 - 24 Enero 2026',
      image:
        'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=400&h=300&fit=crop',
      status: 'completed',
      hotel: 'Resort Ubud',
      people: 1,
      total: 2800,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'completed':
        return 'bg-gray-500/20 text-gray-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'pending':
        return 'Pendiente'
      case 'completed':
        return 'Completado'
      default:
        return status
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-display font-bold mb-4">
          Mis <span className="gradient-text">Viajes</span>
        </h2>
        <p className="text-xl text-gray-400">
          Tus aventuras pasadas y futuras
        </p>
      </motion.div>

      <div className="space-y-6">
        {trips.map((trip, index) => (
          <motion.div
            key={trip.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass rounded-2xl overflow-hidden ${
              trip.status === 'completed' ? 'opacity-75' : ''
            }`}
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={trip.image}
                alt={trip.name}
                className="w-full md:w-64 h-48 object-cover"
              />

              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-display font-bold mb-2">
                      {trip.name}
                    </h4>
                    <p className="text-gray-400">{trip.dates}</p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                      trip.status
                    )}`}
                  >
                    {getStatusLabel(trip.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Plane className="w-5 h-5 text-voyager-blue" />
                    <span className="text-sm">Vuelo incluido</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Hotel className="w-5 h-5 text-voyager-blue" />
                    <span className="text-sm">{trip.hotel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Users className="w-5 h-5 text-voyager-blue" />
                    <span className="text-sm">
                      {trip.people} Persona{trip.people > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-5 h-5 text-voyager-blue" />
                    <span className="text-sm">${trip.total} Total</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 btn-primary">
                    {trip.status === 'completed'
                      ? 'Ver Resumen'
                      : 'Ver Itinerario'}
                  </button>
                  <button className="px-6 py-3 glass rounded-lg hover:bg-white/10 transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default MyTrips
