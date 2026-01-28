import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Star, MapPin, Heart } from 'lucide-react'
import { useState } from 'react'

const Discover = ({ showBookingModal }) => {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filters = [
    { id: 'all', label: 'Todo', icon: '🌍' },
    { id: 'beach', label: 'Playa', icon: '🏖️' },
    { id: 'mountain', label: 'Montaña', icon: '⛰️' },
    { id: 'city', label: 'Ciudad', icon: '🏙️' },
    { id: 'wellness', label: 'Wellness', icon: '🧘' },
    { id: 'adventure', label: 'Aventura', icon: '🏕️' },
  ]

  const destinations = [
    {
      name: 'Santorini',
      location: 'Grecia • Islas Griegas',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
      rating: 4.9,
      price: 450,
      category: 'beach',
      reviews: 234,
    },
    {
      name: 'Bali',
      location: 'Indonesia • Paraíso Tropical',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop',
      rating: 4.8,
      price: 280,
      category: 'wellness',
      reviews: 567,
    },
    {
      name: 'Machu Picchu',
      location: 'Perú • Maravilla del Mundo',
      image: 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=600&h=400&fit=crop',
      rating: 5.0,
      price: 350,
      category: 'adventure',
      reviews: 892,
    },
    {
      name: 'Dubai',
      location: 'Emiratos Árabes • Lujo',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
      rating: 4.7,
      price: 580,
      category: 'city',
      reviews: 423,
    },
    {
      name: 'Nueva York',
      location: 'USA • La Gran Manzana',
      image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&h=400&fit=crop',
      rating: 4.6,
      price: 420,
      category: 'city',
      reviews: 1234,
    },
    {
      name: 'Roma',
      location: 'Italia • Ciudad Eterna',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop',
      rating: 4.9,
      price: 380,
      category: 'city',
      reviews: 789,
    },
    {
      name: 'Maldivas',
      location: 'Océano Índico',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
      rating: 5.0,
      price: 650,
      category: 'beach',
      reviews: 456,
    },
    {
      name: 'Patagonia',
      location: 'Argentina • Naturaleza Salvaje',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop',
      rating: 4.8,
      price: 390,
      category: 'mountain',
      reviews: 321,
    },
    {
      name: 'Barcelona',
      location: 'España • Arte y Cultura',
      image: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=600&h=400&fit=crop',
      rating: 4.7,
      price: 340,
      category: 'city',
      reviews: 945,
    },
  ]

  const filteredDestinations = destinations.filter(dest => {
    const matchesFilter = selectedFilter === 'all' || dest.category === selectedFilter
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-display font-bold mb-4">
          Descubre tu Próxima <span className="gradient-text">Aventura</span>
        </h2>
        <p className="text-xl text-gray-400">
          Explora {destinations.length} destinos increíbles en todo el mundo
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="space-y-6 mb-12">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 w-6 h-6" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca destinos, países, vibes..."
            className="w-full glass rounded-2xl pl-16 pr-6 py-5 text-lg focus:ring-2 focus:ring-voyager-blue transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-voyager-blue" />
            <h3 className="text-lg font-semibold">Filtros</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  selectedFilter === filter.id
                    ? 'bg-voyager-blue text-white shadow-lg shadow-voyager-blue/30'
                    : 'glass hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-gray-400">
        Mostrando {filteredDestinations.length} destinos
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((destination, index) => (
          <motion.div
            key={destination.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl overflow-hidden hover-lift group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <button className="absolute top-4 right-4 p-2 glass-strong rounded-full hover:bg-red-500 transition-colors z-10">
                <Heart className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <h4 className="text-2xl font-display font-bold mb-2">{destination.name}</h4>
              <p className="text-gray-400 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {destination.location}
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold">{destination.rating}</span>
                  <span className="text-gray-400 text-sm">({destination.reviews})</span>
                </div>
                <span className="text-voyager-blue font-bold text-lg">
                  ${destination.price}/noche
                </span>
              </div>
              <button
                onClick={() => showBookingModal(destination.name)}
                className="w-full btn-primary"
              >
                Ver Detalles
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-400 mb-4">
            No se encontraron destinos con estos filtros
          </p>
          <button
            onClick={() => {
              setSelectedFilter('all')
              setSearchQuery('')
            }}
            className="btn-primary"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  )
}

export default Discover
