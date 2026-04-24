# Guía de Despliegue Final: Caborca Boots

Esta guía detalla los pasos técnicos necesarios para poner en producción los tres componentes del proyecto en tu servidor corporativo.

## 1. Back-End (API .NET)
El corazón del sistema. Debe desplegarse primero.

### Ajustes en `appsettings.json`
Localiza este archivo en el servidor y actualiza los siguientes valores:
- **`DefaultConnection`**: Reemplaza `TU_SERVIDOR`, `USUARIO` y `CONTRASEÑA` con los datos de tu instancia de SQL Server de producción.
- **`Jwt:Key`**: Genera una cadena aleatoria de al menos 64 caracteres. Esto es vital para la seguridad.
- **`Smtp`**: Configura los datos del servidor de correo de la empresa para que funcionen los formularios de contacto.

### Base de Datos
1. Exporta el esquema de tu base de datos local `BDCaborca`.
2. Ejecuta el script en el servidor de producción.
3. Asegúrate de que el usuario de la DB tenga permisos de lectura y escritura.

### Permisos de Carpeta
- Crea la carpeta `wwwroot/uploads` dentro del directorio de la API.
- **IMPORTANTE**: Asigna permisos de **Escritura y Modificación** al usuario que ejecuta el pool de aplicaciones (ej: `IIS_IUSRS` en Windows o el usuario de Nginx en Linux). Sin esto, las imágenes del CMS no se guardarán.

---

## 2. Front-Ends (Portafolio y CMS)
Ambos son aplicaciones React que deben ser "compiladas" antes de subirse.

### Configuración de la URL de la API
Para que los frontends sepan dónde está la API, tienes dos opciones:

**Opción A (Recomendada): Archivo .env**
Crea un archivo llamado `.env` en la raíz de la carpeta del Portafolio y del CMS con este contenido:
```env
VITE_API_URL=https://tu-dominio-api.com/api
```

**Opción B: Ajuste en Código**
Si prefieres no usar archivos `.env`, edita los siguientes archivos y cambia `https://api.tusitio.com/api` por tu URL real:
- **Portafolio:** `src/App.jsx` (línea 31).
- **CMS:** `src/api/config.js` (línea 4).

### Proceso de Construcción (Build)
En tu terminal local, dentro de cada carpeta (Portafolio y CMS), ejecuta:
1. `npm install` (instala dependencias).
2. `npm run build` (genera la carpeta `dist`).

Esto generará una carpeta llamada **`dist`**. El contenido de esta carpeta `dist` es lo que debes subir a tu servidor web.

---

## 3. Servidor Web (Consideraciones de Rutas)
Como el proyecto usa **React Router**, si el usuario recarga la página en una ruta interna (ej: `/nosotros`), el servidor podría dar un error 404.

- **Si usas IIS (Windows):** Instala el módulo "URL Rewrite" y crea un archivo `web.config` que redireccione las peticiones a `index.html`.
- **Si usas Apache/Nginx:** Configura la redirección de "Fallback" hacia `index.html`.

---

## 4. Checklist de Funcionamiento Perfecto
- [ ] La API responde en Swagger (`tu-dominio.com/swagger`).
- [ ] El CMS permite Log-In (Valida que el JWT esté bien configurado).
- [ ] Subir una imagen en el CMS y verificar que aparece en el Portafolio.
- [ ] Enviar un correo desde el formulario de contacto y confirmar recepción.
