// BucketList.jsx
import { motion } from 'framer-motion'
import { Plus, Star, Calendar, DollarSign, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export const BucketList = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Ver la Aurora Boreal en Islandia',
      location: 'Reykjavik, Islandia',
      date: 'Diciembre 2026',
      budget: '$3,500',
      completed: false,
      priority: true,
    },
    {
      id: 2,
      title: 'Bucear en la Gran Barrera de Coral',
      location: 'Queensland, Australia',
      date: 'Verano 2027',
      budget: '$4,200',
      completed: false,
      priority: true,
    },
    {
      id: 3,
      title: 'Safari en Serengeti',
      location: 'Tanzania, África',
      date: 'Completado',
      budget: '$5,100',
      completed: true,
      priority: false,
    },
    {
      id: 4,
      title: 'Escalar el Monte Kilimanjaro',
      location: 'Tanzania, África',
      date: '2028',
      budget: '$5,000',
      completed: false,
      priority: true,
    },
    {
      id: 5,
      title: 'Recorrer la Ruta 66',
      location: 'Estados Unidos',
      date: 'Verano 2026',
      budget: '$2,800',
      completed: false,
      priority: false,
    },
    {
      id: 6,
      title: 'Visitar Petra en Jordania',
      location: 'Wadi Musa, Jordania',
      date: 'Primavera 2027',
      budget: '$3,200',
      completed: false,
      priority: true,
    },
  ])

  const toggleComplete = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-display font-bold mb-4">
          Mi <span className="gradient-text">Bucket List</span>
        </h2>
        <p className="text-xl text-gray-400">Lugares que sueño visitar algún día</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer ${
              item.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleComplete(item.id)}
                className="mt-1 w-5 h-5 rounded border-gray-600 text-voyager-blue focus:ring-voyager-blue cursor-pointer"
              />
              <div className="flex-1">
                <h4 className={`text-xl font-bold mb-2 ${
                  item.completed ? 'line-through' : ''
                }`}>
                  {item.title}
                </h4>
                <p className="text-gray-400 mb-3 flex items-center gap-2">
                  <span>📍</span>
                  {item.location}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {item.completed ? (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Completado
                    </span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <DollarSign className="w-4 h-4" />
                        {item.budget}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {item.priority && !item.completed && (
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              )}
              {item.completed && (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <button className="btn-primary mx-auto flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Agregar Nuevo Destino
      </button>
    </div>
  )
}

// MyTrips.jsx
import { Plane, Hotel, Users, DollarSign, MoreVertical } from 'lucide-react'

export const MyTrips = () => {
  const trips = [
    {
      name: 'París Romántico',
      dates: '15 - 22 Marzo 2026',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
      status: 'confirmed',
      hotel: 'Hotel Le Marais',
      people: 2,
      total: 3420,
    },
    {
      name: 'Aventura en los Alpes',
      dates: '5 - 12 Julio 2026',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      status: 'pending',
      hotel: 'Cabaña Alpine',
      people: 4,
      total: 5680,
    },
    {
      name: 'Retiro en Bali',
      dates: '10 - 24 Enero 2026',
      image: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=400&h=300&fit=crop',
      status: 'completed',
      hotel: 'Resort Ubud',
      people: 1,
      total: 2800,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'completed': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'pending': return 'Pendiente'
      case 'completed': return 'Completado'
      default: return status
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
        <p className="text-xl text-gray-400">Tus aventuras pasadas y futuras</p>
      </motion.div>

      <div className="flex gap-4 mb-8">
        <button className="btn-primary">Próximos</button>
        <button className="btn-secondary">Pasados</button>
        <button className="btn-secondary">Cancelados</button>
      </div>

      <div className="space-y-6">
        {trips.map((trip, index) => (
          <motion.div
            key={trip.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass rounded-2xl overflow-hidden hover-lift ${
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
                    <h4 className="text-2xl font-display font-bold mb-2">{trip.name}</h4>
                    <p className="text-gray-400">{trip.dates}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(trip.status)}`}>
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
                    <span className="text-sm">{trip.people} Persona{trip.people > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <DollarSign className="w-5 h-5 text-voyager-blue" />
                    <span className="text-sm">${trip.total} Total</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 btn-primary">
                    {trip.status === 'completed' ? 'Ver Resumen' : 'Ver Itinerario'}
                  </button>
                  <button className="px-6 py-3 glass hover:bg-white/10 rounded-lg transition-all">
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

// Gallery.jsx
import { Upload, Heart, Share2 } from 'lucide-react'

export const Gallery = () => {
  const photos = [
    { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop', location: 'París, Francia', place: 'Torre Eiffel' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', location: 'Alpes Suizos', place: 'Zermatt' },
    { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=400&fit=crop', location: 'Tokio, Japón', place: 'Shibuya' },
    { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop', location: 'Santorini, Grecia', place: 'Oia' },
    { url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop', location: 'Bali, Indonesia', place: 'Ubud' },
    { url: 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=400&h=400&fit=crop', location: 'Machu Picchu, Perú', place: 'Ciudadela Inca' },
    { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop', location: 'Dubai, UAE', place: 'Burj Khalifa' },
    { url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&h=400&fit=crop', location: 'Nueva York, USA', place: 'Times Square' },
    { url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=400&fit=crop', location: 'Roma, Italia', place: 'Coliseo' },
    { url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=400&fit=crop', location: 'París, Francia', place: 'Notre Dame' },
    { url: 'https://images.unsplash.com/photo-1493780474015-ba834fd0ce2f?w=400&h=400&fit=crop', location: 'Bali, Indonesia', place: 'Templo' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=bottom', location: 'Suiza', place: 'Montaña Nevada' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-display font-bold mb-4">
          Mi <span className="gradient-text">Galería</span>
        </h2>
        <p className="text-xl text-gray-400">Recuerdos capturados alrededor del mundo</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="destination-card hover-lift h-64 rounded-2xl group relative"
          >
            <img
              src={photo.url}
              alt={photo.location}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-10 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <h5 className="font-bold text-shadow">{photo.location}</h5>
              <p className="text-sm text-gray-300 text-shadow">{photo.place}</p>
              <div className="flex gap-2 mt-3">
                <button className="p-2 glass-strong rounded-full hover:bg-red-500 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="p-2 glass-strong rounded-full hover:bg-voyager-blue transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="mt-8 btn-primary mx-auto flex items-center gap-2">
        <Upload className="w-5 h-5" />
        Subir Más Fotos
      </button>
    </div>
  )
}

// Profile.jsx
import { Settings, Edit, Trophy, Award, Target, Camera as CameraIcon } from 'lucide-react'

export const Profile = () => {
  const achievements = [
    { icon: Trophy, name: 'Explorador del Mundo', color: 'yellow' },
    { icon: Plane, name: '100 Vuelos', color: 'blue' },
    { icon: CameraIcon, name: 'Fotógrafo Pro', color: 'purple' },
    { icon: MapPin, name: '50 Países', color: 'green' },
    { icon: Heart, name: 'Viajero Frecuente', color: 'red' },
    { icon: Star, name: 'VIP Platino', color: 'orange' },
  ]

  const reviews = [
    {
      stars: 5,
      text: '"Experiencia increíble en París. El hotel era perfecto y la ubicación inmejorable."',
      location: 'París, Francia',
      date: 'Hace 2 semanas',
    },
    {
      stars: 5,
      text: '"Bali superó todas mis expectativas. El retiro de yoga fue transformador."',
      location: 'Bali, Indonesia',
      date: 'Hace 1 mes',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-8 text-center sticky top-28"
          >
            <div className="profile-badge mx-auto mb-4" style={{ width: '120px', height: '120px' }}>
              <div className="profile-badge-inner">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
              </div>
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">Viajero Elite</h3>
            <p className="text-gray-400 mb-6">@explorador_mundial</p>

            <div className="space-y-4 mb-6 text-left">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Nivel</span>
                <span className="font-bold text-voyager-blue">Platino</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Puntos</span>
                <span className="font-bold">12,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Miembro desde</span>
                <span className="font-bold">2022</span>
              </div>
            </div>

            <button className="w-full btn-primary mb-3 flex items-center justify-center gap-2">
              <Edit className="w-4 h-4" />
              Editar Perfil
            </button>
            <button className="w-full btn-secondary flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" />
              Configuración
            </button>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-bold mb-6">Estadísticas de Viaje</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '52', label: 'Países Visitados' },
                { value: '127', label: 'Ciudades' },
                { value: '1,234', label: 'Fotos' },
                { value: '89', label: 'Días Viajando' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-display font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-bold mb-6">Logros Desbloqueados</h3>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement, i) => {
                const Icon = achievement.icon
                return (
                  <div
                    key={i}
                    className={`achievement-badge bg-${achievement.color}-500/20`}
                  >
                    <Icon className={`w-10 h-10 text-${achievement.color}-400 mx-auto mb-2`} />
                    <p className="text-sm font-semibold">{achievement.name}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-bold mb-6">Últimas Reseñas</h3>
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <div key={i} className="border-l-4 border-voyager-blue pl-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(review.stars)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-2">{review.text}</p>
                  <p className="text-sm text-gray-500">{review.location} • {review.date}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
