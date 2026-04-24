# Documentación Técnica: Proyecto Oficial Caborca - API

## 1. Descripción General
Esta API es el núcleo del sistema Caborca Boots, diseñada bajo una arquitectura **RESTful** utilizando **ASP.NET Core 8**. Su propósito principal es servir de puente entre la base de datos SQL Server y los frontends (CMS y Portafolio), gestionando la persistencia de contenidos, seguridad mediante tokens y servicios de mensajería.

---

## 2. Requerimientos del Sistema

### Funcionales
- **Gestión de Identidad**: Autenticación de administradores mediante JWT y control de roles (Admin/SuperAdmin).
- **Control de Contenidos**: Endpoints CRUD para la edición dinámica de todas las secciones del sitio (Nosotros, Responsabilidad, Distribuidores, Inicio).
- **Gestión de Medios**: Sistema de carga y almacenamiento directo en el servidor local para máxima privacidad y control.
- **Notificaciones**: Servicio automatizado de envío de correos electrónicos para formularios de contacto y prospección de distribuidores.
- **Automatización de Despliegue**: Sistema de programación (Scheduling) que permite publicar cambios en una fecha y hora específica de forma autónoma.

### No Funcionales
- **Seguridad**: Todas las rutas sensibles están protegidas por políticas de autorización.
- **Interoperabilidad**: Configuración de políticas **CORS** para permitir peticiones seguras desde múltiples dominios.
- **Robustez**: Implementación de inyección de dependencias para desacoplar servicios de infraestructura (Email, Base de Datos).
- **Trazabilidad**: Integración de Logging para monitorear errores y eventos críticos en el servidor.

---

## 3. Stack Tecnológico

| Componente | Tecnología |
| :--- | :--- |
| **Lenguaje** | C# (C-Sharp) |
| **Framework** | .NET 8.0 (Web API) |
| **Base de Datos** | Microsoft SQL Server |
| **ORM** | Entity Framework Core |
| **Almacenamiento** | Almacenamiento Local (wwwroot) |
| **Notificaciones** | MailKit (Protocolo SMTP) |

---

## 4. Librerías y Dependencias Principales

- **Microsoft.EntityFrameworkCore.SqlServer**: Driver para la comunicación con SQL Server.
- **Almacenamiento Local**: Gestión de archivos multimedia integrado en el servidor.
- **MailKit**: Librería avanzada para el envío de correos electrónicos.
- **System.IdentityModel.Tokens.Jwt**: Generación y validación de tokens de seguridad JSON.
- **Microsoft.AspNetCore.Authentication.JwtBearer**: Middleware de autenticación JWT.
- **Swashbuckle.AspNetCore**: Generación automática de documentación interactiva (Swagger).

---

## 5. Estructura de Carpetas

- `/Controllers`: Definición de endpoints y orquestación de peticiones.
- `/Data`: Contexto de base de datos y mapeo objeto-relacional (EF Core).
- `/Models`: Definición de entidades de negocio y DTOs (Data Transfer Objects).
- `/Services`: Lógica de negocio específica y servicios de infraestructura (Email, Background Tasks).
- `/Migrations`: Historial de cambios y versionamiento del esquema de base de datos.

---

## 6. Configuración de Entornos
La configuración se gestiona a través de los archivos `appsettings.json`, donde se definen:
- Cadenas de conexión a BD.
- Credenciales de Cloudinary.
- Configuración de servidores SMTP.
- Secretos para la firma de JWT.
