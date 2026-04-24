# Documentacion de Codigo - CMS Caborca API

## Alcance
Documento tecnico del backend en `CMS_Caborca_API/CMS_Caborca_API`.
Describe responsabilidad por modulo, endpoints principales, modelos y servicios.

## Punto de entrada

### `CMS_Caborca_API/CMS_Caborca_API/Program.cs`
Responsabilidad:
- Configura DI, EF Core, JWT, CORS, Swagger y servicios de aplicacion.

Configuraciones clave:
- DbContext SQL Server.
- Autenticacion JWT.
- CORS para cliente CMS/Portafolio.
- Inyeccion de `EmailService` y `DeploymentSchedulerService`.

## Controllers

### `Controllers/AuthController.cs`
Responsabilidad:
- Login y administracion de usuarios autenticados.

Metodos principales:
- `Login()`
- `GetUsers()`
- `ChangePassword()`

Dependencias:
- `CaborcaContext`
- JWT config

### `Controllers/HomeController.cs`
Responsabilidad:
- Gestion de contenido de Home en stage/publicado.

Metodos:
- `GetHomeContent()`
- `PutHomeContent()`
- `Deploy()`

Claves de contenido usadas:
- `home_carousel`
- `home_productos_destacados`
- `home_arte_creacion`
- `home_donde_comprar`
- `home_distribuidores_logos`
- `home_sustentabilidad`
- `home_form_distribuidor`

### `Controllers/CatalogosController.cs`
Responsabilidad:
- CRUD de categorias y productos.

Metodos representativos:
- `GetCategorias()`
- `PostCategoria()`
- `GetProductosPublicos()`
- `GetAllProductos()`
- `PostProducto()`
- `PutProducto()`
- CRUD de imagenes de producto

### `Controllers/TextosCMSController.cs`
Responsabilidad:
- Gestor universal de contenidos por pagina.

Metodos:
- `GetTextos(string pagina)`
- `UpdateTextos(string pagina, Dictionary<string, object> payload)`
- `DeployContent()`

### `Controllers/SettingsController.cs`
Responsabilidad:
- Configuracion global del sistema.

Metodos:
- `GetMantenimiento()`
- `UpdateMantenimiento()`

### `Controllers/ContactoController.cs`
Responsabilidad:
- Procesar formularios y envio de correo.

Metodos:
- `EnviarContacto(...)`
- `EnviarDistribuidor(...)`
- `ObtenerDestinatariosAsync(...)`

### `Controllers/UploadController.cs`
Responsabilidad:
- Subida de archivos a `wwwroot/uploads`.

Metodo:
- `Upload(IFormFile file)`

## Data Layer

### `Data/CaborcaContext.cs`
Responsabilidad:
- Definicion de entidades EF Core y relaciones.

DbSets principales:
- `Contenido_Pagina`
- `Categoria_Producto`
- `Producto_Inventario`
- `Imagen_De_Producto`
- `Tienda_Y_Distribuidor`
- `Usuario_Administrador`
- `Configuracion_Del_Sistema`
- `Formularios_Correos`

Reglas relevantes:
- Indice unico para contenido por `(Nombre_Pagina, Clave_Identificadora)`.

## Modelos principales

### `Models/Contenido_Pagina.cs`
Variables clave:
- `Nombre_Pagina`, `Seccion_Pagina`, `Clave_Identificadora`
- `Contenido_Borrador_Stage`
- `Contenido_Publicado_Produccion`
- `Tipo_De_Contenido`

### `Models/Producto_Inventario.cs`
Variables clave:
- `Nombre_ES`, `Nombre_EN`
- `Descripcion_ES`, `Descripcion_EN`
- `Precio`, `Es_Destacado`, `Estado_Publicacion`
- FK a categoria e imagenes

### `Models/Categoria_Producto.cs`
Variables clave:
- `Nombre_ES`, `Nombre_EN`, `Slug`

### `Models/Tienda_Y_Distribuidor.cs`
Variables clave:
- `Nombre`, `Direccion`, `Latitud`, `Longitud`
- `Mostrar_En_Cintillo`

### `Models/Usuario_Administrador.cs`
Variables clave:
- `Usuario`, `PasswordHash`, `Rol`, `Token_Ultima_Sesion`

### `Models/Configuracion_Del_Sistema.cs`
Variables clave:
- `Clave_Configuracion`, `Valor_Configuracion`

### `Models/Formularios_Correos.cs`
Variables clave:
- `Categoria_Formulario`, `Email_Destinatario`

## Servicios

### `Services/EmailService.cs`
Responsabilidad:
- Envio SMTP con MailKit.

Metodo principal:
- `SendEmailAsync(recipients, subject, htmlBody)`

Configuracion:
- Host, Port, UserEmail, Password (appsettings).

### `Services/DeploymentSchedulerService.cs`
Responsabilidad:
- Trabajo en background para deploy programado.

Metodos:
- `StartAsync()`
- `StopAsync()`

## Riesgos tecnicos detectados
- CORS demasiado abierto en configuracion de desarrollo/produccion.
- Falta de validacion estricta de tipo/tamano en upload.
- Falta de documentacion OpenAPI detallada por endpoint.
- No se observa suite de tests automatizados en backend.

## Recomendaciones
- Agregar comentarios XML en controllers y DTOs para Swagger.
- Definir politicas CORS por ambiente.
- Validar MIME y tamano maximo en `UploadController`.
- Agregar pruebas de integracion para Auth, Home, TextosCMS y Contacto.
