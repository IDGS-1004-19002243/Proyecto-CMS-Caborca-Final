# Documentación Técnica: Proyecto Oficial Caborca - CMS

## 1. Descripción General
El **CMS Caborca** es el panel de administración centralizado desarrollado en **React** y **Vite**. Permite a los administradores gestionar de forma dinámica el contenido de la API, controlar la visibilidad del catálogo de productos y supervisar el estado del sistema sin necesidad de intervención técnica.

---

## 2. Requerimientos del Sistema

### Funcionales
- **Autenticación Segura**: Sistema de Login con persistencia de sesión mediante JWT y roles diferenciados (Admin/SuperAdmin).
- **Editor de Contenidos**: Módulos dedicados para la edición de textos, imágenes y videos de cada sección del portafolio (Inicio, Nosotros, Responsabilidad, etc.).
- **Gestión de Catálogo**: Herramientas integradas para subir nuevos productos, marcar artículos como destacados y actualizar información técnica (SKU, categorías).
- **Control de Configuración**: Gestión global de parámetros del portafolio, incluyendo redes sociales, correos de contacto y listado de distribuidores.
- **Modo Mantenimiento**: Interruptor directo para habilitar/deshabilitar la pantalla de "En Construcción" en el frontend del portafolio.
- **Publicación Programada**: Interfaz para definir fechas y horas de despliegue automático de cambios.

### No Funcionales
- **Integridad de Datos**: Validaciones en tiempo real para asegurar que los datos enviados a la API cumplan con los formatos requeridos.
- **Interfaz Intuitiva**: Diseño limpio basado en Tailwind CSS para una gestión rápida y sin curvas de aprendizaje complejas.
- **Notificaciones Reactivas**: Sistema de alertas (Toasts) para confirmar el éxito o fracaso de cada operación asíncrona.
- **Carga de Archivos**: Almacenamiento directo en el servidor local para una gestión centralizada y segura de los activos.

---

## 3. Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Biblioteca UI** | React 18 |
| **Herramienta de Construcción** | Vite |
| **Estilos (CSS)** | Tailwind CSS v4 |
| **Consumo API** | Axios / Fetch |
| **Gestión de Estado** | Context API (Auth & Toasts) |

---

## 4. Estructura de Proyecto

- `/src/api`: Mapeo de endpoints y lógica de comunicación con el Backend.
- `/src/componentes`: Elementos de interfaz reutilizables (Sidebar, Layout, Dropzones).
- `/src/paginas`: Formularios y vistas modulares para cada sección de edición.
- `/src/context`: Capa de servicios transversales (Alertas del sistema y Seguridad).
- `/src/assets`: Recursos estáticos y definiciones de diseño.

---

## 5. Seguridad & Sesión
El CMS implementa una política de seguridad estricta:
- Las rutas administrativas están protegidas por el componente `RutaProtegida`.
- Los tokens de sesión tienen un tiempo de expiración controlado por la API.
- La persistencia local asegura que la sesión se mantenga tras recargos de página, invalidándose automáticamente al hacer Logout.
