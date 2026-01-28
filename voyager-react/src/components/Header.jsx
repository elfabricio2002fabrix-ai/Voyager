import { Link, useLocation } from 'react-router-dom'
import { Search, Bell, Map, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Header = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const navItems = [
    { path: '/', label: 'Inicio' },
    { path: '/discover', label: 'Descubrir' },
    { path: '/bucket-list', label: 'Bucket List' },
    { path: '/my-trips', label: 'Mis Viajes' },
    { path: '/gallery', label: 'Galería' },
    { path: '/profile', label: 'Perfil' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Map className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold gradient-text hidden sm:block">
              VOYAGER
            </h1>
          </Link>

          {/* Search Bar */}
          <div className={`relative hidden md:block transition-all duration-300 ${
            searchFocused ? 'w-96' : 'w-80'
          }`}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Busca destinos, vibes o actividades..."
              className="w-full glass rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-voyager-blue transition-all"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active text-voyager-blue' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="absolute -top-8 right-0 bg-black/90 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                3 notificaciones
              </span>
            </button>

            <div className="h-8 w-px bg-white/10 hidden md:block"></div>

            <Link to="/profile" className="profile-badge group">
              <div className="profile-badge-inner">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transform group-hover:scale-110 transition-transform"></div>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full glass rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-voyager-blue transition-all"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-white/10"
          >
            <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-voyager-blue text-white'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
