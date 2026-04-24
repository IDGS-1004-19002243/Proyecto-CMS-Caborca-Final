# Documentacion de Codigo - Portafolio Caborca React

## 1) Alcance
Este documento cubre el frontend publico en `Portafolio_Caborca_React/src`.
Resume que hace cada modulo, funciones clave, estados (`useState`) y variables importantes.

## 2) Flujo general de la app
- Entrada: `src/main.jsx`
- Router y modo mantenimiento: `src/App.jsx`
- Idioma global e i18n de campos `_ES/_EN`: `src/context/LanguageProvider.jsx`
- Vistas: `src/paginas/*.jsx`
- Componentes de layout: `src/components/*` y wrappers en `src/componentes/*`
- Servicios API: `src/api/*`

## 3) Entrada y routing

### `src/main.jsx`
- `createRoot(...)`: monta React en `#root`.
- `LanguageProvider`: envuelve toda la app para exponer `language`, `setLanguage` y `t(obj, campo)`.

### `src/App.jsx`
Responsabilidad:
- Define rutas publicas.
- Consulta bandera de mantenimiento en `/api/Settings/Mantenimiento`.

Estados:
- `isMaintenance`: activa vista de mantenimiento global.
- `loadingConfig`: bloquea render hasta terminar lectura inicial.

Funciones:
- `checkMaintenance()`: obtiene config de mantenimiento y actualiza estado.

Rutas:
- Home: `/`
- Catalogos: `/catalogo/hombre`, `/catalogo/mujer`
- Detalle: `/producto/:catalogo/:id`
- Corporativas: `/nosotros`, `/responsabilidad-ambiental`, `/distribuidores`, `/contacto`
- Legadas: `/catalogo-hombre`, `/catalogo-mujer`
- Estado: `/mantenimiento`
- Fallback 404: `*`

## 4) Contexto de idioma

### `src/context/LanguageContext.js`
- `LanguageContext`: contexto reactivo global.
- `useLanguage()`: hook de acceso seguro al contexto.

### `src/context/LanguageProvider.jsx`
Responsabilidad:
- Detecta idioma inicial por locale/region/zona horaria.
- Persiste preferencia en `localStorage` (`caborca_pref_lang`).
- Expone helper de traduccion tolerante a formato.

Constantes:
- `VALID_LANGUAGES`
- `SPANISH_REGION_CODES`
- `ENGLISH_REGION_CODES`

Funciones:
- `detectLanguageByRegion()`: deteccion inicial (`es`/`en`).
- `hasValue(value)`: valida vacios.
- `getKeyInsensitive(obj, key)`: lectura case-insensitive.
- `t(obj, field)`: resuelve por prioridad: llave activa `_ES/_EN` -> fallback idioma opuesto -> campo plano.

Estados:
- `language`

Efectos:
- Persistencia a `localStorage`.
- Sincronizacion de `document.documentElement.lang`.

## 5) Servicios API

### `src/api/homeService.js`
Responsabilidad:
- Lectura de contenido Home y catalogos publicos.

Metodos:
- `getHomeContent()` -> `GET /api/Home`
- `getCatalogoHombre()` -> `GET /api/Settings/CatalogoHombre`
- `getCatalogoMujer()` -> `GET /api/Settings/CatalogoMujer`

### `src/api/textosService.js`
Responsabilidad:
- Lectura de bloques CMS por pagina.

Metodos:
- `getTextos(pagina)` -> `GET /api/cms/content/{pagina}`

### `src/api/contactoService.js`
Responsabilidad:
- Envio de formularios publicos.

Metodos:
- `enviarContacto(datos)` -> `POST /api/Contacto`
- `enviarSolicitudDistribuidor(datos)` -> `POST /api/Contacto/Distribuidor`

## 6) Layout y componentes base

### `src/components/Header.jsx`
Responsabilidad:
- Navbar desktop/mobile.
- Selector de idioma.
- Navegacion de catalogo con dropdown.
- Click en logo con recarga completa.

Estados:
- `mobileMenuOpen`
- `mobileDropdownOpen`
- `hovered`

Funciones:
- `toggleMobileMenu()`
- `navigateToLang(e, lang)`
- `handleLogoClick(e)`

### `src/components/Footer.jsx`
Responsabilidad:
- Footer corporativo con enlaces y redes dinamicas.
- Carga de telefono y redes desde `ConfiguracionGeneral`.

Estados:
- `socials`
- `telefono`

Variables:
- `socialIcons`: mapa de iconos SVG por red.
- `labels`: textos por idioma.
- `visibleSocialEntries`: redes visibles (`show=true`).

### `src/componentes/Encabezado.jsx`
- Wrapper de compatibilidad: reexporta `src/components/Header.jsx`.

### `src/componentes/PieDePagina.jsx`
- Wrapper de compatibilidad: reexporta `src/components/Footer.jsx`.

### `src/componentes/Carrusel.jsx`
Responsabilidad:
- Hero slider de Home con fallback si API falla.

Estados:
- `diapositivaActual`
- `rawSlides`

Refs:
- `intervalRef`: temporizador de autoplay.

Funciones:
- `startAutoSlide()`
- `handleDotClick(indice)`

Computados:
- `diapositivas` (`useMemo`): adapta campos CMS a estructura de render.

### `src/components/ui/Button.jsx`
- Boton reusable con variantes (`primary`, `secondary`, `outline`) y tamanos (`sm`, `md`, `lg`).

### `src/components/ui/Container.jsx`
- Contenedor reusable con tamanos (`sm`, `default`, `lg`, `full`).

### `src/components/ui/Section.jsx`
- Seccion reusable con presets de padding y fondo.

### `src/components/ui/ProductCard.jsx`
- Tarjeta reusable de producto para listados.
- Lee `product.id`, `product.name`, `product.image`, `product.catalogoPadre`.

## 7) Paginas

### `src/paginas/Inicio.jsx`
Responsabilidad:
- Home publica: carrusel, destacados, arte, distribuidores, mapa y formulario de captacion.

Estados:
- `activeFilter`
- `formInicio`
- `enviandoInicio`
- `resultadoInicio`
- `rawContent`
- `configGeneral`
- `productosCatalogoDestacados`

Funciones utilitarias:
- `createMapPin(selected)`
- `normalizeWebsiteUrl(url)`
- `mapTipoVentaLabel(tipo, language)`
- `tt(es, en)`
- `hasValue(value)`
- `isSkuCode(value)`
- `normalizeToken(value)`
- `getFeaturedProductText(producto, field, options)`
- `getFeaturedSkuDisplay(producto)`
- `getFeaturedCategoryLabel(producto)`
- `getFeaturedMetaLabel(producto)`

Notas i18n de producto:
- Lectura estricta por idioma para nombre/badge/meta.
- En EN, evita mostrar texto neutral libre en espanol si no existe traduccion valida.

### `src/paginas/CatalogoHombre.jsx`
Responsabilidad:
- Listado, filtro y orden de productos de caballero.

Estados:
- `ordenarPor`
- `estilo`
- `listaProductos`
- `contenido`

Funciones:
- `hasValue(value)`
- `getProductText(producto, field, options)`
- `isSkuCode(value)`
- `normalizeToken(value)`
- `getSkuDisplay(producto)`
- `getCategoryLabel(producto)`

Notas i18n:
- Render estricto por idioma en `nombre`, `badge`, `sku/categoria`.

### `src/paginas/CatalogoMujer.jsx`
Responsabilidad y estructura:
- Equivalente funcional de CatalogoHombre para catalogo de dama.

Estados:
- `ordenarPor`
- `estilo`
- `listaProductos`
- `contenido`

Funciones:
- `hasValue(value)`
- `getProductText(producto, field, options)`
- `isSkuCode(value)`
- `normalizeToken(value)`
- `getSkuDisplay(producto)`
- `getCategoryLabel(producto)`

### `src/paginas/DetalleProducto.jsx`
Responsabilidad:
- Detalle de producto por `catalogo` e `id`, con galeria y ficha tecnica.

Estados:
- `producto`
- `imagenPrincipal`
- `imagenSeleccionadaIndex`
- `loading`

Funciones:
- `hasValue(value)`
- `getProductText(item, field, options)`
- `isSkuCode(value)`
- `normalizeToken(value)`
- `getSkuDisplay(item)`
- `getCategoryLabel(item)`

Computados:
- `breadcrumbs` (`useMemo`)
- `imagenes`
- `materialesRaw` y `materialesTexto`

### `src/paginas/Distribuidores.jsx`
Responsabilidad:
- Busqueda/filtrado de distribuidores, geolocalizacion y mapa interactivo.
- Captura de solicitud de distribuidor.

Estados principales:
- `formulario`, `enviandoDist`, `resultadoDist`
- `tipoCompra`, `estadoFiltro`, `resultados`
- `mensajeUbicacion`, `selectedStore`
- `mapCenter`, `mapZoom`
- `allDistribuidores`
- `hero`, `formDist`, `mapInfo`

Funciones utilitarias:
- `createMapPin(selected)`
- `FlyToMarker({center, zoom})`
- `calculateDistance(...)`
- `normalizeWebsiteUrl(url)`
- `formatAddress(store, language)`
- `getStoreCity(store, language)`
- `getStoreState(store, language)`
- `normalizeTipoVenta(tipo)`
- `manejarUbicarme()`
- `manejarAplicarFiltros()`
- `manejarLimpiarFiltros()`
- `seleccionarTienda(store)`

### `src/paginas/Contacto.jsx`
Responsabilidad:
- Formulario de contacto publico y tarjetas de contacto dinamicas.
- Integracion con redes y configuracion general.

Estados:
- `formulario`, `enviando`, `resultado`
- `socials`, `generalConfig`
- `hero`, `cards`, `formPreview`, `seccionAyuda`, `seccionMapa`

Funciones:
- `manejarCambioFormulario(evento)`
- `manejarEnvioFormulario(evento)`
- `iconoPorCard(id)`

### `src/paginas/Nosotros.jsx`
Responsabilidad:
- Presentacion institucional (origen, crecimiento, hoy, artesania, proceso, legado).

Estado:
- `rawContent`

Funciones:
- `getTranslatedParagraphs(obj, key)`
- `getProcesoStat(obj)`
- `getStatValue(stat)`
- `renderParagraphs(paragraphs)`

### `src/paginas/ResponsabilidadAmbiental.jsx`
Responsabilidad:
- Pagina de sostenibilidad con bloques de contenido, cifras y video.

Estado:
- `content`

Funciones:
- `renderTitle(raw)`

### `src/paginas/EnConstruccion.jsx`
Responsabilidad:
- Pantalla global de mantenimiento con redes configurables.

Estado:
- `content`

Variables:
- `defaultContent`
- `socialIcons`

### `src/paginas/NotFound.jsx`
Responsabilidad:
- Vista 404 dinamica con textos CMS.

Estado:
- `content`

Variables:
- `defaultContent`

## 8) Convenciones de datos e i18n
- Campos bilingues preferidos: `campo_ES` y `campo_EN`.
- Fallback permitido: campo neutral `campo` cuando no existen llaves bilingues.
- En vistas de producto (home/catalogos/detalle) se aplica politica estricta para evitar mezcla de idiomas.

## 9) Limpieza realizada (estado actual)
- Se resolvieron advertencias de clases Tailwind y duplicados reportadas en `src`.
- `get_errors` sobre `Portafolio_Caborca_React/src` devuelve sin errores.
- Build validado con `npm run build`.

## 10) Siguiente fase recomendada
- Crear `README` tecnico para API (`CMS_Caborca_API`) y CMS admin (`CMS_Caborca_React`) con el mismo nivel de detalle.
- Definir checklist de release: build, smoke test EN/ES, pruebas de formularios, mapa y catalogos.
