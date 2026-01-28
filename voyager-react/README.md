# 🌍 Voyager - Modern Travel Planning Platform

Una plataforma completa de planificación de viajes construida con React, Vite, Tailwind CSS y Framer Motion.

![Voyager](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=400&fit=crop)

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz elegante con glassmorphism y gradientes
- 🚀 **Alto Rendimiento**: Construido con Vite para desarrollo y builds ultra-rápidos
- 📱 **Responsive**: Diseño adaptable para todos los dispositivos
- 🎭 **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- 🗺️ **Descubrimiento de Destinos**: Explora destinos con filtros avanzados
- 📋 **Bucket List**: Organiza tus viajes soñados
- 🎫 **Gestión de Viajes**: Administra reservas y itinerarios
- 🖼️ **Galería Interactiva**: Comparte y organiza fotos de viajes
- 👤 **Perfil Personalizado**: Estadísticas, logros y reseñas

## 🛠️ Tecnologías

- **React 18** - Biblioteca UI moderna
- **Vite** - Build tool ultra-rápido
- **React Router DOM** - Navegación client-side
- **Tailwind CSS** - Framework de utilidades CSS
- **Framer Motion** - Librería de animaciones
- **Lucide React** - Iconos modernos
- **Date-fns** - Manipulación de fechas

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn

### Instalación

1. **Clonar o descargar el proyecto**

```bash
cd voyager-react
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
```

3. **Iniciar servidor de desarrollo**

```bash
npm run dev
# o
yarn dev
```

4. **Abrir en el navegador**

Visita `http://localhost:3000`

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa del build de producción
- `npm run lint` - Ejecuta el linter

## 📁 Estructura del Proyecto

```
voyager-react/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Notification.jsx
│   │   └── BookingModal.jsx
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Home.jsx
│   │   ├── Discover.jsx
│   │   ├── BucketList.jsx
│   │   ├── MyTrips.jsx
│   │   ├── Gallery.jsx
│   │   └── Profile.jsx
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Funciones auxiliares
│   ├── assets/          # Imágenes y recursos
│   ├── styles/          # Estilos adicionales
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
├── postcss.config.js    # Configuración de PostCSS
└── package.json
```

## 🎨 Paleta de Colores

- **Voyager Blue**: `#2b8cee` - Color principal
- **Voyager Purple**: `#8a2be2` - Color acento
- **Dark Background**: `#0b0c10` - Fondo oscuro
- **Card Background**: `#192633` - Tarjetas

## 🎯 Páginas

### 🏠 Home
- Hero section con animaciones parallax
- Estadísticas de viaje
- Destinos destacados
- Call-to-action

### 🔍 Discover
- Búsqueda de destinos
- Filtros por categoría
- Grid de destinos con información
- Sistema de favoritos

### 📋 Bucket List
- Lista de deseos de viajes
- Marcación de completados
- Prioridades y fechas estimadas
- Presupuestos

### ✈️ My Trips
- Viajes próximos, pasados y cancelados
- Detalles de reservas
- Estado de confirmación
- Gestión de itinerarios

### 🖼️ Gallery
- Grid de fotos masonry
- Hover effects
- Información de ubicación
- Opciones para compartir

### 👤 Profile
- Estadísticas personalizadas
- Logros desbloqueados
- Reseñas de viajes
- Configuración de cuenta

## 🔧 Personalización

### Colores

Edita `tailwind.config.js` para cambiar los colores:

```js
colors: {
  voyager: {
    blue: '#2b8cee',
    dark: '#0b0c10',
    // ...
  },
}
```

### Animaciones

Las animaciones están configuradas en `src/index.css` y usan Framer Motion en los componentes.

### Fuentes

Las fuentes se cargan desde Google Fonts:
- **Playfair Display** - Títulos
- **Space Grotesk** - Cuerpo

## 🌐 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Arrastra la carpeta 'dist' a Netlify
```

### GitHub Pages

```bash
npm run build
# Configura GitHub Pages para servir desde /dist
```

## 📝 Próximas Características

- [ ] Integración con APIs de viajes reales
- [ ] Sistema de autenticación
- [ ] Modo offline / PWA
- [ ] Compartir itinerarios
- [ ] Integración con redes sociales
- [ ] Sistema de recomendaciones con IA
- [ ] Chat con otros viajeros
- [ ] Mapas interactivos

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Agradecimientos

- Iconos por [Lucide](https://lucide.dev/)
- Imágenes por [Unsplash](https://unsplash.com/)
- Animaciones con [Framer Motion](https://www.framer.com/motion/)
- Estilos con [Tailwind CSS](https://tailwindcss.com/)

## 📧 Contacto

¿Preguntas o sugerencias? Abre un issue en GitHub.

---

**Hecho con ❤️ para viajeros del mundo**
