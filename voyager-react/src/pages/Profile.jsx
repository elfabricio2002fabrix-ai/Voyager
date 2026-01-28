// Profile.jsx
import { motion } from 'framer-motion'

import {
  Settings,
  Edit,
  Trophy,
  Camera as CameraIcon,
  Plane,
  MapPin,
  Heart,
  Star
} from 'lucide-react'

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

export default Profile