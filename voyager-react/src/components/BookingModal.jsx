import { X, Calendar, User, DollarSign, Shield, Plane, Car, Map } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const BookingModal = ({ show, destination, onClose, onConfirm }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    insurance: false,
    flights: true,
    transfers: false,
    tours: false,
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateTotal = () => {
    let total = 2450 // Base price
    if (formData.insurance) total += 120
    if (formData.flights) total += 850
    if (formData.transfers) total += 80
    if (formData.tours) total += 200
    return total
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-display font-bold">Reservar Viaje</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Steps Indicator */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                          step >= num
                            ? 'bg-voyager-blue text-white'
                            : 'bg-white/10 text-white/40'
                        }`}
                        animate={{ scale: step === num ? 1.1 : 1 }}
                      >
                        {num}
                      </motion.div>
                      <p className="text-sm mt-2">
                        {num === 1 ? 'Detalles' : num === 2 ? 'Viajeros' : 'Pago'}
                      </p>
                    </div>
                    {num < 3 && (
                      <div
                        className={`h-1 flex-1 transition-colors ${
                          step > num ? 'bg-voyager-blue' : 'bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Destination Card */}
              <div className="glass rounded-2xl p-6 mb-6">
                <h4 className="text-2xl font-bold mb-4">{destination}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Fecha de Fin
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Adultos
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.adults}
                      onChange={(e) => handleChange('adults', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Niños
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.children}
                      onChange={(e) => handleChange('children', parseInt(e.target.value))}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Extras */}
              <div className="glass rounded-2xl p-6 mb-6">
                <h4 className="text-xl font-bold mb-4">Extras</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.insurance}
                      onChange={(e) => handleChange('insurance', e.target.checked)}
                      className="rounded border-white/20 bg-transparent text-voyager-blue focus:ring-voyager-blue"
                    />
                    <Shield className="w-5 h-5 text-voyager-blue" />
                    <span className="flex-1">Seguro de viaje</span>
                    <span className="text-voyager-blue font-semibold">+$120</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.flights}
                      onChange={(e) => handleChange('flights', e.target.checked)}
                      className="rounded border-white/20 bg-transparent text-voyager-blue focus:ring-voyager-blue"
                    />
                    <Plane className="w-5 h-5 text-voyager-blue" />
                    <span className="flex-1">Vuelos incluidos</span>
                    <span className="text-voyager-blue font-semibold">+$850</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.transfers}
                      onChange={(e) => handleChange('transfers', e.target.checked)}
                      className="rounded border-white/20 bg-transparent text-voyager-blue focus:ring-voyager-blue"
                    />
                    <Car className="w-5 h-5 text-voyager-blue" />
                    <span className="flex-1">Traslados aeropuerto</span>
                    <span className="text-voyager-blue font-semibold">+$80</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.tours}
                      onChange={(e) => handleChange('tours', e.target.checked)}
                      className="rounded border-white/20 bg-transparent text-voyager-blue focus:ring-voyager-blue"
                    />
                    <Map className="w-5 h-5 text-voyager-blue" />
                    <span className="flex-1">Tours guiados</span>
                    <span className="text-voyager-blue font-semibold">+$200</span>
                  </label>
                </div>
              </div>

              {/* Price Summary */}
              <div className="gradient-bg rounded-2xl p-6 mb-6">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  Resumen de Precio
                </h4>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Alojamiento (7 noches)</span>
                    <span>$2,450</span>
                  </div>
                  {formData.insurance && (
                    <div className="flex justify-between">
                      <span>Seguro de viaje</span>
                      <span>$120</span>
                    </div>
                  )}
                  {formData.flights && (
                    <div className="flex justify-between">
                      <span>Vuelos</span>
                      <span>$850</span>
                    </div>
                  )}
                  {formData.transfers && (
                    <div className="flex justify-between">
                      <span>Traslados</span>
                      <span>$80</span>
                    </div>
                  )}
                  {formData.tours && (
                    <div className="flex justify-between">
                      <span>Tours guiados</span>
                      <span>$200</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tasas e impuestos</span>
                    <span>$120</span>
                  </div>
                  <div className="border-t border-white/20 pt-2 mt-2"></div>
                  <div className="flex justify-between text-2xl font-bold text-white">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 btn-secondary">
                  Cancelar
                </button>
                <button onClick={onConfirm} className="flex-1 btn-primary">
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BookingModal
