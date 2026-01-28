import { motion } from 'framer-motion'
import { ChevronDown, Plane, MapPin, Camera, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const Home = ({ showBookingModal }) => {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const destinations = [
    {
      name: 'París',
      country: 'Francia',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
      description: 'La Ciudad de la Luz te espera',
      price: 450,
    },
    {
      name: 'Alpes Suizos',
      country: 'Suiza',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      description: 'Aventura en las alturas',
      price: 520,
    },
    {
      name: 'Tokio',
      country: 'Japón',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      description: 'Donde el futuro es presente',
      price: 380,
    },
  ]

  const stats = [
    { icon: MapPin, value: '52', label: 'Países Visitados' },
    { icon: Star, value: '127', label: 'Ciudades Exploradas' },
    { icon: Camera, value: '1.2K', label: 'Fotos Capturadas' },
    { icon: Plane, value: '34', label: 'Aventuras Planeadas' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 hero-gradient opacity-50"></div>
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-voyager-blue rounded-full opacity-20 blur-3xl"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-voyager-purple rounded-full opacity-20 blur-3xl"
          animate={{
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-display font-bold mb-6 text-shadow-lg">
              Explora el{' '}
              <span className="gradient-text">Mundo</span>
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            >
              Descubre destinos increíbles, planifica aventuras épicas y crea recuerdos inolvidables
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/discover')}
              className="btn-primary text-lg px-8 py-4"
            >
              Comenzar a Explorar
            </button>
            <button
              onClick={() => navigate('/bucket-list')}
              className="btn-secondary text-lg px-8 py-4"
            >
              Ver Mi Bucket List
            </button>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-16"
          >
            <ChevronDown className="w-10 h-10 text-voyager-blue mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="stat-card group"
              >
                <Icon className="w-12 h-12 text-voyager-blue mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-5xl font-display font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Destinos Destacados
          </h3>
          <p className="text-xl text-gray-400">
            Los lugares más increíbles que no puedes perderte
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="destination-card hover-lift h-96 rounded-2xl group"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end">
                <motion.div
                  initial={{ y: 20 }}
                  whileHover={{ y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-bold text-voyager-blue uppercase tracking-widest mb-1">
                    {destination.country}
                  </p>
                  <h4 className="text-3xl font-display font-bold mb-2 text-shadow">
                    {destination.name}
                  </h4>
                  <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {destination.description}
                  </p>
                  <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>4.9</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-voyager-blue font-bold">
                      ${destination.price}/noche
                    </span>
                  </div>
                  <button
                    onClick={() => showBookingModal(destination.name)}
                    className="w-full btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Reservar Ahora
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-bg rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-4">
              ¿Listo para tu próxima aventura?
            </h3>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Únete a miles de viajeros que ya están explorando el mundo con Voyager
            </p>
            <button
              onClick={() => navigate('/discover')}
              className="btn-primary bg-white text-voyager-blue hover:bg-gray-100 text-lg px-8 py-4"
            >
              Descubre Destinos
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Home
