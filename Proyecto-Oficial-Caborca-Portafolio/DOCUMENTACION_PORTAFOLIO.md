# Documentación Técnica: Proyecto Oficial Caborca - Portafolio

## 1. Descripción General
El **Portafolio Caborca** es una aplicación web moderna (SPA) desarrollada con **React** y **Vite**. Representa la identidad digital de Caborca Boots, ofreciendo una experiencia inmersiva para el usuario final donde puede explorar catálogos, conocer la historia de la marca y contactar a la empresa.

---

## 2. Requerimientos del Sistema

### Funcionales
- **Experiencia de Usuario (Home)**: Pantalla de inicio dinámica con un carrusel de alto impacto visual y secciones informativas sincronizadas con el CMS.
- **Catálogos Inteligentes**: Vistas segregadas para Hombre y Mujer con filtrado por categorías y visualización detallada de productos.
- **Localización de Distribuidores**: Mapa interactivo integrado con **Leaflet** que muestra puntos de venta globales en tiempo real.
- **Internacionalización (i18n)**: Soporte completo para múltiples idiomas (Español/Inglés) con persistencia de preferencia del usuario.
- **Formularios de Contacto**: Integración directa con el servicio de correos de la API para consultas generales y solicitudes de distribución.

### No Funcionales
- **Diseño Responsive**: Adaptabilidad total a dispositivos móviles, tablets y escritorio bajo una filosofía *Mobile-First*.
- **Rendimiento**: Optimización de carga mediante el uso de Vite, compresión de assets y lazy loading de rutas.
- **SEO & Accesibilidad**: Estructura semántica de HTML5, atributos ARIA y manejo de metadatos para mejorar el posicionamiento.
- **Estética Premium**: Uso de micro-animaciones, transiciones fluidas y una paleta de colores coherente con el branding de lujo.

---

## 3. Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Biblioteca UI** | React 18 |
| **Herramienta de Construcción** | Vite |
| **Estilos (CSS)** | Tailwind CSS v4 |
| **Enrutamiento** | React Router 7 |
| **Manejo de Mapas** | React Leaflet / OpenStreetMap |

---

## 4. Librerías y Dependencias Principales

- **Lucide React**: Set de iconos vectoriales consistentes y ligeros.
- **Leaflet**: Motor para mapas interactivos.
- **Framer Motion**: (Si aplica) Orquestación de animaciones complejas y transiciones de estado.
- **PostCSS**: Procesamiento avanzado de estilos.

---

## 5. Arquitectura de Frontend

- `/src/api`: Capa de servicios para peticiones asíncronas (Fetch API).
- `/src/components`: Componentes reutilizables de la interfaz (Botones, Cards, UI Elements).
- `/src/context`: Gestión del estado global mediante **Context API** (ej: Idioma, Configuración).
- `/src/paginas`: Vistas de alto nivel que orquestan los componentes de página.
- `/src/assets`: Recursos estáticos como fuentes corporativas, imágenes y SVGs locales.

---

## 6. Variables de Entorno
El proyecto requiere un archivo `.env` con la siguiente estructura para su correcto funcionamiento:
- `VITE_API_URL`: URL base de la API (Producción o Local).
