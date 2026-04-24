using CMS_Caborca_API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- Soporte para Windows Service (Self-Contained en WS 2012 R2) ---
// Permite que el .exe se ejecute como un Servicio de Windows nativo.
// Cuando corre como servicio, ajusta el directorio de trabajo al directorio del .exe
// para que appsettings.json, wwwroot/uploads y otros recursos se encuentren correctamente.
builder.Host.UseWindowsService(options =>
{
    options.ServiceName = "CaborcaCMS API";
});

// Fijar el directorio de trabajo al directorio del ejecutable.
// Critico cuando corre como Windows Service (el working dir por defecto es C:\Windows\System32).
if (!Environment.CurrentDirectory.Equals(AppContext.BaseDirectory, StringComparison.OrdinalIgnoreCase))
{
    Directory.SetCurrentDirectory(AppContext.BaseDirectory);
}

// --- Configurar Kestrel explicitamente (HTTP/1.1 compatible con WS2012 R2) ---
// WS2012 R2 no soporta HTTP/2 via TLS con el motor Schannel antiguo.
// Kestrel hara un Graceful Downgrade automatico, pero lo declaramos explicitamente.
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // Escuchar en HTTP puro (IIS o el firewall del servidor maneja el HTTPS externamente)
    serverOptions.ListenAnyIP(5000);
});


// --- Servicios de Infraestructura y Datos ---

// Configuración de Entity Framework Core con SQL Server
builder.Services.AddDbContext<CaborcaContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registro de Controladores y Servicios de Aplicación
builder.Services.AddControllers();

// Servicios en segundo plano para tareas programadas (Ej: Tareas de despliegue)
builder.Services.AddHostedService<CMS_Caborca_API.Services.DeploymentSchedulerService>();

// Inyección de dependencias para el servicio de mensajería (Emails)
builder.Services.AddScoped<CMS_Caborca_API.Services.IEmailService, CMS_Caborca_API.Services.EmailService>();

// --- Configuración de Seguridad y Acceso ---

// Política de CORS: Permite la comunicación con los frontends de React
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Documentación de API mediante Swagger/OpenAPI con soporte para JWT
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "CMS_Caborca_API",
        Version = "v1",
        Description = "API para la gestión de contenidos y catálogo de Caborca"
    });

    // Definir el esquema de seguridad para JWT
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Ingrese 'Bearer' [espacio] y luego su token.\n\nEjemplo: 'Bearer 12345abcdef'"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Autenticación basada en JWT (JSON Web Tokens)
var jwtConfig = builder.Configuration.GetSection("Jwt");
var key = jwtConfig["Key"];
var issuer = jwtConfig["Issuer"];
var audience = jwtConfig["Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!))
        };
    });

var app = builder.Build();

// --- Auto-Migración de Base de Datos ---
// Esto creará la BD automáticamente si no existe al arrancar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CaborcaContext>();
    try {
        db.Database.Migrate();
    } catch {
        // Ignorar en caso de no poder conectar en el primer intento del servicio
    }
}

// --- Configuración de Middleware (Pipeline HTTP) ---

// Swagger habilitado siempre: util para diagnostico en produccion dentro de la red interna.
// Si deseas restringirlo, cambia la condicion a: if (app.Environment.IsDevelopment())
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "CMS Caborca API v1");
    options.RoutePrefix = "swagger"; // Acceso en: http://servidor:5000/swagger
});


// En produccion con Kestrel puro (sin HTTPS en el servidor legacy), desactivar la redireccion.
// El HTTPS debe manejarse en un proxy externo si se requiere.
// app.UseHttpsRedirection(); // <- DESACTIVADO intencionalmente para WS2012 R2

// Habilitar la exposición de archivos estáticos (Útil para almacenamiento local de imágenes)
app.UseStaticFiles(); 

app.UseCors("PermitirReact"); 

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
