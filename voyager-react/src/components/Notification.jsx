import { CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Notification = ({ show, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed top-20 right-6 z-[100] glass-strong rounded-xl p-4 shadow-2xl max-w-md"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Notification
