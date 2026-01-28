# 🚀 Guía de Configuración - Voyager

## Pasos para Ejecutar el Proyecto

### 1. Instalar Node.js

Si no tienes Node.js instalado:
- Descarga desde https://nodejs.org/ (versión LTS recomendada)
- Verifica la instalación:
  ```bash
  node --version
  npm --version
  ```

### 2. Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- React y React DOM
- React Router para navegación
- Framer Motion para animaciones
- Tailwind CSS para estilos
- Lucide React para iconos
- Vite como build tool

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Verás algo como:
```
  VITE v5.1.4  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 4. Abrir en el Navegador

- Abre tu navegador
- Ve a `http://localhost:3000`
- ¡La aplicación debería estar funcionando!

## 🎨 Personalización Rápida

### Cambiar Colores

Edita `tailwind.config.js`:

```js
colors: {
  voyager: {
    blue: '#2b8cee',    // Cambia a tu color favorito
    purple: '#8a2be2',  // Color secundario
    dark: '#0b0c10',    // Fondo
  },
}
```

### Agregar Nuevos Destinos

Edita `src/pages/Discover.jsx` y agrega objetos al array `destinations`:

```js
{
  name: 'Mi Destino',
  location: 'País • Región',
  image: 'URL_DE_LA_IMAGEN',
  rating: 5.0,
  price: 999,
  category: 'beach', // beach, mountain, city, wellness, adventure
  reviews: 100,
}
```

### Personalizar el Hero

Edita `src/pages/Home.jsx` para cambiar el título y descripción principal.

## 📦 Build para Producción

Cuando estés listo para desplegar:

```bash
npm run build
```

Esto creará una carpeta `dist/` con los archivos optimizados.

### Vista Previa del Build

```bash
npm run preview
```

## 🐛 Solución de Problemas

### Error: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 en uso

El puerto se puede cambiar en `vite.config.js`:

```js
server: {
  port: 3001, // Cambia a otro puerto
}
```

### Estilos no se aplican

Asegúrate de que Tailwind está configurado correctamente:
1. Verifica que `postcss.config.js` existe
2. Revisa que `tailwind.config.js` tiene las rutas correctas
3. Reinicia el servidor de desarrollo

## 🚀 Deploy Rápido

### Vercel (Gratis)

1. Instala Vercel CLI: `npm install -g vercel`
2. Ejecuta: `vercel`
3. Sigue las instrucciones

### Netlify (Gratis)

1. Construye: `npm run build`
2. Arrastra la carpeta `dist/` a https://app.netlify.com/drop

## 💡 Tips de Desarrollo

- **Hot Reload**: Los cambios se reflejan automáticamente
- **React DevTools**: Instala la extensión para debugging
- **Console**: Usa `console.log()` para debugging
- **Componentes**: Cada componente es un archivo `.jsx`

## 📚 Recursos Útiles

- [Documentación de React](https://react.dev/)
- [Guía de Vite](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)

## ✅ Checklist de Configuración

- [ ] Node.js instalado (v18+)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor funcionando (`npm run dev`)
- [ ] Navegador abierto en localhost:3000
- [ ] Veo la aplicación Voyager
- [ ] Las animaciones funcionan
- [ ] La navegación entre páginas funciona

## 🎉 ¡Todo Listo!

Tu aplicación Voyager está configurada y lista para desarrollo.

¿Necesitas ayuda? Abre un issue en GitHub o consulta la documentación.

---

**Happy Coding! 🚀✈️**
