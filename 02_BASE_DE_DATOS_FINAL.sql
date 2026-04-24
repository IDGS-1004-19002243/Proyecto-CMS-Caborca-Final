-- =======================================================
-- SCRIPT BASE DE DATOS FINAL - PROYECTO CMS CABORCA
-- Versión: 3.1 (Documentada al detalle)
-- Fecha: 18/02/2026
-- =======================================================

-- Verificar si la BD existe, si no, crearla
IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'CaborcaDB')
BEGIN
    CREATE DATABASE CaborcaDB;
END
GO

USE CaborcaDB;
GO

-- =======================================================
-- 1. SISTEMA DE SEGURIDAD Y USUARIOS
-- =======================================================
-- Esta tabla gestiona quién puede entrar al CMS (Panel de Administración).
CREATE TABLE Usuarios (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- Identificador único autoincrementable del usuario (1, 2, 3...)
    
    NombreUsuario NVARCHAR(50) NOT NULL UNIQUE, 
    -- Nombre de login (ej: 'admin', 'ruben'). UNIQUE asegura que no se repitan.
    
    PasswordHash NVARCHAR(255) NOT NULL, 
    -- Contraseña ENCRIPTADA. Nunca guardar texto plano. El backend usará bcrypt/argon2.
    
    Rol NVARCHAR(20) DEFAULT 'Admin', 
    -- Define permisos: 
    -- 'Superadmin': Acceso total (Usuarios, Configuración, Auditoría).
    -- 'Admin': Solo puede editar contenido (Productos, Textos).
    
    UltimoAcceso DATETIME -- Se actualiza cada vez que el usuario hace Login.
);

-- =======================================================
-- 2. SISTEMA DE PUBLICACIÓN (DEPLOY / VISIBILIDAD)
-- =======================================================
-- Aquí vive el contenido que ven los CLIENTES en el sitio web público.
-- El CMS NO edita esto directamente. El CMS edita las tablas de la sección 3.
-- Al dar clic en "Publicar", los datos viajan de la Sección 3 a esta tabla (Sección 2).

CREATE TABLE ContenidoPublicado (
    Clave NVARCHAR(50) PRIMARY KEY, 
    -- Identificador de la sección (ej: 'HOME', 'NOSOTROS', 'CATALOGO').
    
    DatosJSON NVARCHAR(MAX), 
    -- Todo el contenido de esa sección guardado como un TEXTO JSON gigante.
    -- ¿Por qué? Para que el Frontend lo lea en 1 sola consulta, sin hacer JOINs lentos.
    -- Ejemplo: { "titulo": "Bienvenidos", "banners": [ ... ] }
    
    UltimaActualizacion DATETIME DEFAULT GETDATE(), -- Cuándo se publicó esta versión.
    Version INT DEFAULT 1 -- Número de versión para control de cambios.
);

CREATE TABLE BitacoraDespliegues (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    UsuarioId INT FOREIGN KEY REFERENCES Usuarios(Id), 
    -- Quién hizo el despliegue (Relación con tabla Usuarios).
    
    SeccionDesplegada NVARCHAR(50), 
    -- Qué sección se actualizó ('Global', 'Home', etc).
    
    Fecha DATETIME DEFAULT GETDATE() -- Cuándo ocurrió.
    -- Esta tabla es SOLO visible para el Superadmin en los logs.
);

-- =======================================================
-- 3. TABLAS DE EDICIÓN (CMS - "STAGE" / BORRADOR)
-- =======================================================
-- Aquí se guardan los datos mientras el Admin está escribiendo/editando.
-- Los cambios aquí NO salen al público hasta que se "Publique".

-- 3.1 CONFIGURACIÓN GLOBAL
-- Datos generales que afectan a todo el sitio.
CREATE TABLE ConfiguracionSitio (
    Id INT IDENTITY(1,1) PRIMARY KEY, -- Siempre será 1 fila única.
    
    -- Modo Mantenimiento: Si es 1 (True), el sitio público muestra "En Construcción".
    EnMantenimiento BIT DEFAULT 0,
    
    -- Campos para la Página "En Construcción" (EditarMantenimiento.jsx)
    MantenimientoTitulo_ES NVARCHAR(100),
    MantenimientoTitulo_EN NVARCHAR(100),
    MantenimientoSubtitulo_ES NVARCHAR(100),
    MantenimientoSubtitulo_EN NVARCHAR(100),
    MantenimientoMensaje_ES NVARCHAR(500),
    MantenimientoMensaje_EN NVARCHAR(500),
    MantenimientoImagenFondo NVARCHAR(255),

    -- Datos de Contacto (visible en Footer/Header):
    EmailContacto NVARCHAR(100), -- Correo visible al público.
    Telefono NVARCHAR(50),
    Direccion_ES NVARCHAR(200),
    Direccion_EN NVARCHAR(200),
    Horario_ES NVARCHAR(100), -- [Nuevo] EditarContacto.jsx
    Horario_EN NVARCHAR(100), 
    MapaEmbedUrl NVARCHAR(MAX), -- [Nuevo] Iframe de Google Maps

    -- Textos Formulario de Contacto (EditarContacto.jsx)
    ContactoTituloForm_ES NVARCHAR(100),
    ContactoTituloForm_EN NVARCHAR(100),
    ContactoDescForm_ES NVARCHAR(200),
    ContactoDescForm_EN NVARCHAR(200),

    -- Textos Formulario Distribuidores (EditarDistribuidores.jsx)
    DistribuidorTituloForm_ES NVARCHAR(100),
    DistribuidorTituloForm_EN NVARCHAR(100),
    DistribuidorDescForm_ES NVARCHAR(200),
    DistribuidorDescForm_EN NVARCHAR(200),

    -- Página 404 (EditarNotFound.jsx)
    NotFoundTitulo_ES NVARCHAR(100),
    NotFoundTitulo_EN NVARCHAR(100),
    NotFoundMensaje_ES NVARCHAR(200),
    NotFoundMensaje_EN NVARCHAR(200),
    NotFoundTextoBoton_ES NVARCHAR(50),
    NotFoundTextoBoton_EN NVARCHAR(50),
    NotFoundImagenFondo NVARCHAR(255),

    -- Configuración de NOTIFICACIONES (Backend):
    -- Correos internos que recibirán los mensajes de los formularios.
    EmailsReceptoresContacto NVARCHAR(MAX),      -- Lista de emails para "Formulario de Contacto".
    EmailsReceptoresDistribuidores NVARCHAR(MAX) -- Lista de emails para "Solicitud de Distribuidor".
    -- (Aviso de Privacidad eliminado por solicitud del usuario).
);

-- Redes Sociales que aparecen en el pie de página.
CREATE TABLE RedesSociales (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    Plataforma NVARCHAR(50), -- Nombre (ej: 'Facebook', 'Instagram').
    
    Url NVARCHAR(255), 
    -- El enlace real a tu perfil social (ej: 'https://instagram.com/caborca').
    
    Activo BIT DEFAULT 1 
    -- Interruptor On/Off: 
    -- 1 = El ícono aparece en el sitio. 
    -- 0 = El ícono se oculta (sin borrar el registro de la BD).
);

-- 3.2 HOME PAGE (Página de Inicio)
-- Controla el carrusel principal de imágenes deslizantes.
CREATE TABLE HomeCarousel (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    -- Textos en dos idiomas
    Titulo_ES NVARCHAR(100),
    Titulo_EN NVARCHAR(100),
    Subtitulo_ES NVARCHAR(100),
    Subtitulo_EN NVARCHAR(100),
    
    -- Botón de llamada a la acción (ej: "Ver Catálogo")
    TextoBoton_ES NVARCHAR(50),
    TextoBoton_EN NVARCHAR(50),
    LinkBoton NVARCHAR(255), -- A dónde lleva el clic.
    
    ImagenUrl NVARCHAR(255), -- Ruta de la imagen subida (/uploads/hero1.webp).
    
    Orden INT DEFAULT 0, -- Para controlar qué slide va primero (1, 2, 3...).
    Activo BIT DEFAULT 1 -- Para ocultar temporalmente un slide.
);

-- Textos estáticos de las secciones del Home (Arte, Sustentabilidad, etc).
CREATE TABLE HomeSecciones (
    Clave NVARCHAR(50) PRIMARY KEY, 
    -- Identificador único (ej: 'SeccionArte', 'SeccionDistribuidores').
    
    Titulo_ES NVARCHAR(100),
    Titulo_EN NVARCHAR(100),
    Subtitulo_ES NVARCHAR(200),
    Subtitulo_EN NVARCHAR(200),
    
    Descripcion_ES NVARCHAR(MAX), -- Texto largo/párrafos.
    Descripcion_EN NVARCHAR(MAX),
    
    TextoBoton_ES NVARCHAR(50),
    TextoBoton_EN NVARCHAR(50),
    LinkBoton NVARCHAR(255),
    
    ImagenUrl NVARCHAR(255), -- Imagen de acompañamiento.
    VideoUrl NVARCHAR(255)   -- URL de video (YouTube/MP4) si aplica.
);

-- Cintillo de logotipos de clientes/distribuidores en el Home.
CREATE TABLE HomeLogosDistribuidores (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NombreDistribuidor NVARCHAR(100), -- Nombre interno para referencia.
    LogoUrl NVARCHAR(255),            -- Imagen del logo.
    Orden INT DEFAULT 0,              -- Orden de aparición de izquierda a derecha.
    Activo BIT DEFAULT 1
);

-- 3.3 PÁGINAS ESTÁTICAS (Nosotros, Responsabilidad Social)
-- Tabla genérica para guardar secciones de texto e imagen.
CREATE TABLE PaginasEstaticas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    Pagina NVARCHAR(50),  -- A qué página pertenece (ej: 'Nosotros', 'Responsabilidad').
    Seccion NVARCHAR(50), -- Qué bloque es (ej: 'Historia', 'Mision', 'Energia').
    
    Titulo_ES NVARCHAR(100),
    Titulo_EN NVARCHAR(100),
    Contenido_ES NVARCHAR(MAX), -- Contenido HTML rico o texto largo.
    Contenido_EN NVARCHAR(MAX),
    
    ImagenUrl NVARCHAR(255),
    VideoUrl NVARCHAR(255),
    
    -- Campos flexibles para datos especiales (ej: "1978" en historia, o badgetext).
    DatoExtra1_ES NVARCHAR(100), 
    DatoExtra1_EN NVARCHAR(100),
    DatoExtra2 NVARCHAR(100),    
    
    Orden INT DEFAULT 0
);

-- Tabla para elementos repetibles (Stats en Nosotros/Responsabilidad)
-- Frontend usa arrays de objetos { number, label }
CREATE TABLE PaginaEstadisticas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    PaginaEstaticaId INT FOREIGN KEY REFERENCES PaginasEstaticas(Id) ON DELETE CASCADE,
    
    Valor NVARCHAR(50), -- Ej: "+50", "1978"
    Etiqueta_ES NVARCHAR(100), -- Ej: "Años de experiencia"
    Etiqueta_EN NVARCHAR(100),
    
    Orden INT DEFAULT 0
);

-- 3.4 CATÁLOGO DE PRODUCTOS (Simplificado)
-- Categorías principales (ej: Botas Hombre, Botas Mujer).
CREATE TABLE Categorias (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre_ES NVARCHAR(50), -- 'Caballero'
    Nombre_EN NVARCHAR(50), -- 'Men'
    Codigo NVARCHAR(50) UNIQUE -- Identificador interno ('hombre', 'mujer').
);

-- Fichas de Producto.
CREATE TABLE Productos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    CategoriaId INT FOREIGN KEY REFERENCES Categorias(Id), -- Relación con Categoría.
    
    Nombre_ES NVARCHAR(150),
    Nombre_EN NVARCHAR(150),
    Descripcion_ES NVARCHAR(MAX), -- HTML con detalles del producto.
    Descripcion_EN NVARCHAR(MAX),
    
    Precio DECIMAL(10,2), -- Precio referencial (opcional).
    
    ImagenPortada NVARCHAR(255), -- La foto que sale en el catálogo (miniatura).
    ImagenDetalle NVARCHAR(255), -- La foto HD para el Zoom en detalle.
    
    -- Etiquetas para filtros rápidos en el Home:
    Destacado BIT DEFAULT 0, -- Si es 1, sale en "Destacados" del Home.
    Nuevo BIT DEFAULT 0,     -- Si es 1, tiene etiqueta "Nuevo".
    
    FechaCreacion DATETIME DEFAULT GETDATE(),
    Activo BIT DEFAULT 1 -- 0 = Producto oculto/borrado lógico.
);

-- Galería extra de fotos (si un producto tiene más de 1 foto).
CREATE TABLE ProductoGaleria (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductoId INT FOREIGN KEY REFERENCES Productos(Id) ON DELETE CASCADE,
    Url NVARCHAR(255),
    Orden INT
);

-- Tabla para tarjetas de informacion en pagina de Contacto (Ventas, RH, etc)
CREATE TABLE ContactoTarjetas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Titulo_ES NVARCHAR(100),
    Titulo_EN NVARCHAR(100),
    Icono NVARCHAR(50), -- Nombre del icono o SVG path
    Contenido_ES NVARCHAR(MAX), -- Lista de telefonos/emails separada por saltos de linea
    Contenido_EN NVARCHAR(MAX),
    Orden INT DEFAULT 0,
    Activo BIT DEFAULT 1
);

-- 3.5 DISTRIBUIDORES (Directorio de Tiendas)
-- Lista de tiendas físicas donde comprar.
CREATE TABLE Tiendas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    
    Nombre NVARCHAR(150), -- Nombre de la tienda (ej: "Botas El Norteño").
    Tipo NVARCHAR(50),    -- 'Exclusiva', 'Multimarca', 'Online'.
    
    -- Dirección desglosada para mostrarla bien formateada.
    Calle NVARCHAR(100),
    Numero NVARCHAR(20),
    Colonia NVARCHAR(100),
    Ciudad NVARCHAR(100),
    Estado NVARCHAR(100),
    CodigoPostal NVARCHAR(10),
    Pais NVARCHAR(50) DEFAULT 'México',
    
    Telefono NVARCHAR(50),
    SitioWeb NVARCHAR(255), -- Link a Google Maps o sitio web de la tienda.
    
    -- Coordenadas GPS (Opcionales).
    -- Si se llenan, el mapa puede poner un pin exacto. Si no, usa la dirección.
    Latitud DECIMAL(9,6),
    Longitud DECIMAL(9,6),
    
    Activo BIT DEFAULT 1
);

-- =======================================================
-- 4. DATOS SEMILLA (Información Inicial Automática)
-- =======================================================
-- Datos que se insertan solos al crear la BD para que no esté vacía.

-- Usuarios Fijos Iniciales (Passwords temporales/placeholders)
INSERT INTO Usuarios (NombreUsuario, PasswordHash, Rol)
VALUES 
('superadmin', 'HASH_SUPER_123', 'Superadmin'), -- Usuario Maestro
('admin', 'HASH_ADMIN_123', 'Admin');           -- Usuario Editor

-- Configuración Inicial básica
INSERT INTO ConfiguracionSitio (EnMantenimiento, EmailsReceptoresContacto)
VALUES (0, 'contacto@caborca.com');

-- Creación automática de las dos categorías principales
INSERT INTO Categorias (Nombre_ES, Nombre_EN, Codigo) VALUES 
('Caballero', 'Men', 'hombre'),
('Dama', 'Women', 'mujer');

GO
