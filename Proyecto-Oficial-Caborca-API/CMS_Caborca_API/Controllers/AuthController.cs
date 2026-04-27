using CMS_Caborca_API.Data;
using CMS_Caborca_API.Models;
using CMS_Caborca_API.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using CMS_Caborca_API.Services;

namespace CMS_Caborca_API.Controllers
{
    /// <summary>
    /// Controlador encargado de la autenticación de usuarios administradores.
    /// Gestiona el inicio de sesión, generación de tokens JWT y cambios de contraseña.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CaborcaContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthController(CaborcaContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        /// <summary>
        /// Valida las credenciales del usuario y devuelve un token JWT para acceso autorizado.
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto request)
        {
            // Búsqueda del usuario por nombre de usuario
            var user = await _context.Usuarios_Administradores
                .FirstOrDefaultAsync(u => u.Usuario == request.Usuario);

            if (user == null)
            {
                return Unauthorized("Usuario no existe.");
            }

            // Validación de contraseña (comparación directa)
            if (user.PasswordHash != request.Password)
            {
                return Unauthorized("Contraseña incorrecta.");
            }

            // Creación del token de sesión
            string token = CrearToken(user);

            // Registro persistente del último token generado para control de sesión
            user.Token_Ultima_Sesion = token; 
            await _context.SaveChangesAsync();

            return Ok(new { token = token, rol = user.Rol });
        }

        /// <summary>
        /// Obtiene la lista de usuarios administradores configurados en el sistema.
        /// Solo accesible para cuentas con rol de Admin.
        /// </summary>
        [HttpGet("users")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult> GetUsers()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var user = await _context.Usuarios_Administradores.FirstOrDefaultAsync(u => u.Usuario == username);
            if (user == null) return NotFound("Usuario no encontrado.");

            // Verificación de privilegios elevados (El rol Admin puede ver usuarios)
            bool isAdmin = user.Rol == "Admin" || user.Usuario.ToLower() == "admin";
            if (!isAdmin) return StatusCode(403, "No autorizado.");

            var users = await _context.Usuarios_Administradores
                .Select(u => new { u.Usuario, u.Rol })
                .ToListAsync();

            return Ok(users);
        }

        /// <summary>
        /// Realiza el cambio de contraseña para el usuario actual o para un tercero si se tiene rol Admin.
        /// </summary>
        [HttpPost("change-password")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto request)
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var adminUser = await _context.Usuarios_Administradores
                .FirstOrDefaultAsync(u => u.Usuario == username);

            if (adminUser == null) return NotFound("Usuario no encontrado.");

            // Permitir al rol Admin gestionar contraseñas
            bool isAdmin = adminUser.Rol == "Admin" || adminUser.Usuario.ToLower() == "admin";
            if (!isAdmin)
            {
                return StatusCode(403, "Solo el rol Admin puede cambiar contraseñas de otros usuarios.");
            }

            if (adminUser.PasswordHash != request.CurrentPassword)
                return BadRequest("La contraseña actual es incorrecta.");

            var targetUser = adminUser;
            if (!string.IsNullOrEmpty(request.TargetUsername))
            {
                targetUser = await _context.Usuarios_Administradores
                    .FirstOrDefaultAsync(u => u.Usuario == request.TargetUsername);
                if (targetUser == null) return NotFound("El usuario destino no existe.");
            }

            // Actualización de la credencial en texto plano (según requerimiento de la base de datos actual)
            targetUser.PasswordHash = request.NewPassword;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Contraseña actualizada exitosamente." });
        }

        /// <summary>
        /// Lógica interna para la construcción del JWT firmado basado en los claims del usuario.
        /// </summary>
        private string CrearToken(Usuario_Administrador user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Usuario),
                new Claim(ClaimTypes.Role, user.Rol ?? "Admin")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("Jwt:Key").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
                issuer: _configuration.GetSection("Jwt:Issuer").Value,
                audience: _configuration.GetSection("Jwt:Audience").Value,
                claims: claims,
                expires: DateTime.Now.AddDays(1), // Vigencia de 24 horas
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}