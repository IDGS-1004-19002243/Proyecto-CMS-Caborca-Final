# Documentacion de Codigo - CMS Caborca React

## Alcance
Documento tecnico del panel administrativo en `CMS_Caborca_React/src`.
Describe servicios API, contexto global, layout admin y paginas de edicion.

## Entrada y enrutado

### `src/main.jsx`
Responsabilidad:
- Monta React y envuelve la app con `ToastProvider`.

### `src/App.jsx`
Responsabilidad:
- Define rutas publicas/protegidas del CMS.
- Aplica proteccion por token (`RutaProtegida`).

Rutas clave:
- `/login`
- `/editar-inicio`
- `/catalogo-hombre`
- `/catalogo-mujer`
- `/editar-nosotros`
- `/editar-contacto`
- `/editar-distribuidores`
- `/editar-responsabilidad`
- `/editar-mantenimiento`
- `/editar-notfound`
- `/configuracion`

## Capa API (frontend)

### `src/api/config.js`
Responsabilidad:
- Instancia axios base del CMS.

Variables y comportamiento:
- `API_URL` desde `VITE_API_URL`.
- Interceptor request: agrega `Authorization: Bearer <token>`.
- Interceptor response: maneja 401 para forzar reautenticacion.

### `src/api/auth.js`
Metodos:
- `login(credentials)`
- `logout()`
- `getCurrentUser()`
- `isAuthenticated()`
- `getAdminUsers()`
- `changePassword(payload)`

Persistencia:
- `localStorage.adminToken`
- `localStorage.adminUser`

### `src/api/homeService.js`
Metodos:
- `getHomeContent()`
- `updateHomeContent(payload)`
- `uploadImage(file)`
- `deployContent()`

Nota:
- Limpia valores base64 antes de enviar.

### `src/api/textosService.js`
Metodos:
- `getTextos(pagina)`
- `updateTextos(pagina, payload)`
- `deployContent()`

### `src/api/settingsService.js`
Metodos:
- `getMantenimiento()`
- `updateMantenimiento(payload)`
- `getDeploySchedule()`
- `setDeploySchedule(payload)`
- `getConfiguracionGeneral()`
- `updateConfiguracionGeneral(payload)`
- `getCatalogoHombre()` / `updateCatalogoHombre(payload)`
- `getCatalogoMujer()` / `updateCatalogoMujer(payload)`

### `src/api/uploadService.js`
Metodos:
- `uploadImage(file)`

## Contexto global

### `src/context/ToastContext.jsx`
Responsabilidad:
- Sistema de notificaciones globales.

Estados/refs:
- `toasts`
- `timersRef`

Funciones:
- `addToast(message, type, duration)`
- `success(message)`
- `error(message)`
- `info(message)`
- `removeToast(id)`

## Layout y componentes compartidos

### `src/componentes/LayoutAdmin.jsx`
Responsabilidad:
- Shell administrativo (sidebar + topbar + outlet).
- Cambio de idioma de la interfaz de edicion.

Estados:
- `menuAbierto`
- `lang`

Funciones:
- `cerrarSesion()`

Dependencias:
- `useNavigate`
- `useLocation`
- `localStorage.cms:editor:lang`

### `src/componentes/Header.jsx`
Responsabilidad:
- Header responsive para secciones publicas/preview dentro CMS.

Estados:
- `mobileMenuOpen`

### `src/componentes/EditButton.jsx`
Responsabilidad:
- Boton estandar para acciones de editar.

### `src/componentes/BotonesPublicar.jsx`
Responsabilidad:
- Botones para guardar/borrador/publicar.

Funciones comunes:
- acciones de deploy y feedback visual de estado.

### `src/componentes/MapPickerPanel.jsx`
Responsabilidad:
- Selector de ubicacion en mapa (lat/lng) para distribuidores.

### `src/componentes/Footer.jsx`
Responsabilidad:
- Pie de pagina del CMS/preview.

## Paginas de administracion

### `src/paginas/Login.jsx`
Responsabilidad:
- Autenticacion de administradores.

Estados:
- `credenciales`
- `error`
- `cargando`
- `mostrarPassword`

Flujo:
- Llama `authService.login`.
- Guarda token/usuario en localStorage.
- Redirige a dashboard.

### `src/paginas/EditarInicio.jsx`
Responsabilidad:
- Editor de Home (carrusel, destacados, arte, distribuidores, mapa, sustentabilidad).

Estados relevantes:
- `modoEdicion`
- `elementoEditando`
- `contenido` (objeto complejo por secciones)

Funciones comunes:
- carga inicial desde API
- normalizacion de contenido
- guardado por seccion
- deploy de cambios

### `src/paginas/CatalogoHombre.jsx`
Responsabilidad:
- CRUD de productos/categorias de catalogo hombre.

Estados tipicos:
- `modoEdicion`
- `elementoEditando`
- `productos`
- `categoriasVisibles`

Funciones esperadas:
- crear/editar/eliminar producto
- manejo de imagenes
- publicar catalogo

### `src/paginas/CatalogoMujer.jsx`
Responsabilidad:
- CRUD de productos/categorias de catalogo mujer.

Estructura:
- paralela a `CatalogoHombre`.

### `src/paginas/EditarNosotros.jsx`
Responsabilidad:
- Gestion de bloques de contenido institucional.

Estado:
- `contenido`

### `src/paginas/EditarContacto.jsx`
Responsabilidad:
- Configura textos de contacto, tarjetas, formulario y datos de apoyo.

Estado:
- `contenido` y subestructuras de seccion.

### `src/paginas/EditarDistribuidores.jsx`
Responsabilidad:
- CRUD de distribuidores y ubicaciones geograficas.

Estados:
- `distribuidores`
- `modoEdicion`

### `src/paginas/EditarResponsabilidad.jsx`
Responsabilidad:
- Edicion de contenidos de responsabilidad ambiental.

### `src/paginas/EditarMantenimiento.jsx`
Responsabilidad:
- Activa/desactiva mantenimiento y agenda de despliegue.

Estados:
- `mantenimientoActivo`
- `titulo`
- `mensaje`
- `deploySchedule`

### `src/paginas/EditarNotFound.jsx`
Responsabilidad:
- Edicion de textos/estilo de pagina 404.

### `src/paginas/Configuracion.jsx`
Responsabilidad:
- Configuracion global de parametros del sitio (general).

## Riesgos tecnicos detectados
- Token JWT en localStorage (exposicion potencial ante XSS).
- Falta de pruebas automatizadas visibles.
- Falta de tipado fuerte (TypeScript/JSDoc extensivo).
- Manejo de errores distribuido, no centralizado.

## Recomendaciones
- Agregar pruebas unitarias de servicios API y validaciones de formularios.
- Migrar gradualmente a TypeScript o reforzar JSDoc.
- Estandarizar manejo de errores en interceptores y hooks.
- Definir checklist de publicacion por pagina (guardar, validar, deploy).
