# Portafolio Caborca React

Proyecto de portafolio para Caborca Boots desarrollado con React y Vite. Este proyecto es una recreación exacta del MockUp V1 utilizando tecnologías modernas.

## 🚀 Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite** - Herramienta de construcción rápida para proyectos frontend
- **React Router DOM** - Enrutamiento para aplicaciones React
- **Tailwind CSS** - Framework de CSS utilitario
- **PostCSS** - Procesador de CSS

## 📁 Estructura del Proyecto

```
Portafolio_Caborca_React/
├── src/
│   ├── componentes/
│   │   ├── Encabezado.jsx      # Header con navegación
│   │   ├── Carrusel.jsx         # Carousel hero con efecto parallax
│   │   └── PieDePagina.jsx      # Footer del sitio
│   ├── paginas/
│   │   ├── Inicio.jsx           # Página principal
│   │   ├── CatalogoHombre.jsx   # Catálogo botas hombre
│   │   ├── CatalogoMujer.jsx    # Catálogo botas mujer
│   │   ├── Nosotros.jsx         # Sobre la empresa
│   │   ├── ResponsabilidadAmbiental.jsx
│   │   ├── Distribuidores.jsx   # Formulario distribuidores
│   │   └── Contacto.jsx         # Página de contacto
│   ├── App.jsx                  # Componente principal con rutas
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales con Tailwind
├── public/                      # Archivos estáticos
├── tailwind.config.js          # Configuración de Tailwind
├── postcss.config.js           # Configuración de PostCSS
├── package.json                # Dependencias del proyecto
└── vite.config.js              # Configuración de Vite
```

## 🎨 Características

- ✅ Todas las variables en **español**
- ✅ Diseño completamente **responsive**
- ✅ **Componentes reutilizables**
- ✅ Navegación con **React Router**
- ✅ Efecto **parallax** en el carousel
- ✅ **Formularios funcionales** con manejo de estado
- ✅ **Menú móvil** interactivo
- ✅ **Dropdown** para categorías de productos
- ✅ Integración de **Google Maps**
- ✅ Diseño fiel al **MockUp V1**

## 🛠️ Instalación y Uso

### Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Instalación

```bash
# Navegar al directorio del proyecto
cd "Portafolio_Caborca_React"

# Instalar dependencias (si aún no están instaladas)
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:5173/`

### Producción

```bash
# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🗺️ Rutas del Sitio

- `/` - Página principal (Inicio)
- `/catalogo-hombre` - Catálogo de botas para hombre
- `/catalogo-mujer` - Catálogo de botas para mujer
- `/nosotros` - Sobre Caborca Boots
- `/responsabilidad-ambiental` - Compromiso ambiental
- `/distribuidores` - Formulario para ser distribuidor
- `/contacto` - Página de contacto

## 🎨 Colores de la Marca

```css
--caborca-cafe: #332B1E
--caborca-negro: #262F29
--caborca-beige-suave: #F5F1E8
```

## 📝 Componentes Principales

### Encabezado
- Navegación principal con dropdown
- Selector de idioma (ES/EN)
- Menú móvil responsive

### Carrusel
- 3 diapositivas con auto-slide (30 segundos)
- Efecto parallax en movimiento del mouse
- Puntos de navegación interactivos

### PieDePagina
- Información de la empresa
- Enlaces rápidos organizados
- Redes sociales
- Copyright

## 🔧 Convenciones de Código

- **Nombres de variables**: camelCase en español (ej: `productoActual`, `listaProductos`)
- **Nombres de componentes**: PascalCase (ej: `Encabezado`, `PieDePagina`)
- **Nombres de funciones**: camelCase con prefijo de acción (ej: `manejarClick`, `obtenerProductos`)
- **Archivos de componentes**: PascalCase con extensión `.jsx`

## 📦 Dependencias Principales

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.1.1",
  "tailwindcss": "^3.4.17"
}
```

## 🌟 Mejoras Futuras

- [ ] Integración con backend para productos dinámicos
- [ ] Sistema de autenticación
- [ ] Carrito de compras
- [ ] Panel de administración (CMS)
- [ ] Optimización de imágenes
- [ ] Tests unitarios y de integración
- [ ] Internacionalización completa (i18n)

## 👥 Autor

Proyecto desarrollado para Caborca Boots

## 📄 Licencia

© 2025 Caborca Boots. Todos los derechos reservados.
