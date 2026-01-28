// Gallery.jsx
import { motion } from 'framer-motion'
import { Upload, Heart, Share2 } from 'lucide-react'

const Gallery = () => {
  const photos = [
    { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop', location: 'París, Francia', place: 'Torre Eiffel' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', location: 'Alpes Suizos', place: 'Zermatt' },
    { url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=400&fit=crop', location: 'Tokio, Japón', place: 'Shibuya' },
    { url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop', location: 'Santorini, Grecia', place: 'Oia' },
    { url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=400&fit=crop', location: 'Bali, Indonesia', place: 'Ubud' },
    { url: 'https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?w=400&h=400&fit=crop', location: 'Machu Picchu, Perú', place: 'Ciudadela Inca' },
    { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop', location: 'Dubai, UAE', place: 'Burj Khalifa' },
    { url: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=400&h=400&fit=crop', location: 'Nueva York, USA', place: 'Times Square' },
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
        <p className="text-xl text-gray-400">
          Recuerdos capturados alrededor del mundo
        </p>
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

export default Gallery
