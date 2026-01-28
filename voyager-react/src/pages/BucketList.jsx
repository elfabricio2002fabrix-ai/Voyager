// BucketList.jsx
import { motion } from 'framer-motion'
import { Plus, Star, Calendar, DollarSign, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const BucketList = () => {
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
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
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
        <p className="text-xl text-gray-400">
          Lugares que sueño visitar algún día
        </p>
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
                <h4
                  className={`text-xl font-bold mb-2 ${
                    item.completed ? 'line-through' : ''
                  }`}
                >
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

export default BucketList
