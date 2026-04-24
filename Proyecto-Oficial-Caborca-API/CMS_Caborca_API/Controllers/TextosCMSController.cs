using CMS_Caborca_API.Data;
using CMS_Caborca_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace CMS_Caborca_API.Controllers
{
    [Route("api/cms/content")]
    [ApiController]
    /// <summary>
    /// Gestiona textos dinámicos por página para CMS y frontend público.
    /// </summary>
    public class TextosCMSController : ControllerBase
    {
        private readonly CaborcaContext _context;

        /// <summary>
        /// Inicializa el controlador de textos CMS.
        /// </summary>
        /// <param name="context">Contexto de persistencia.</param>
        public TextosCMSController(CaborcaContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtiene el contenido consolidado de una página.
        /// Devuelve borrador para usuarios autenticados y producción para público.
        /// </summary>
        /// <param name="pagina">Nombre de la página a consultar.</param>
        [HttpGet("{pagina}")]
        public async Task<ActionResult<Dictionary<string, object>>> GetTextos(string pagina)
        {
            // Validamos si es usuario del CMS para mostrar borrador, o público para mostrar publicado.
            bool isCMS = User.Identity?.IsAuthenticated == true;

            var contenidos = await _context.Contenidos_Paginas
                .Where(c => c.Nombre_Pagina == pagina)
                .ToListAsync();

            var result = new Dictionary<string, object>();

            foreach (var item in contenidos)
            {
                string jsonBody = isCMS 
                    ? (item.Contenido_Borrador_Stage ?? item.Contenido_Publicado_Produccion ?? "{}") 
                    : (item.Contenido_Publicado_Produccion ?? "{}");

                try 
                {
                    result[item.Clave_Identificadora] = JsonSerializer.Deserialize<object>(jsonBody) ?? new object();
                } 
                catch 
                {
                    // Fallback to raw string if it was not valid JSON
                    result[item.Clave_Identificadora] = jsonBody;
                }
            }

            return Ok(result);
        }

        /// <summary>
        /// Actualiza contenido en stage/borrador para una página.
        /// </summary>
        /// <param name="pagina">Nombre de página a actualizar.</param>
        /// <param name="textos">Bloques de contenido serializados por clave.</param>
        [HttpPut("{pagina}")]
        [Authorize]
        public async Task<ActionResult> UpdateTextos(string pagina, [FromBody] Dictionary<string, JsonElement> textos)
        {
            foreach (var kvp in textos)
            {
                var record = await _context.Contenidos_Paginas
                    .FirstOrDefaultAsync(c => c.Nombre_Pagina == pagina && c.Clave_Identificadora == kvp.Key);

                if (record == null)
                {
                    // Lo creamos si no existe
                    record = new Contenido_Pagina
                    {
                        Nombre_Pagina = pagina,
                        Seccion_Pagina = "General", 
                        Clave_Identificadora = kvp.Key,
                        Tipo_De_Contenido = "json",
                        Contenido_Publicado_Produccion = ""
                    };
                    _context.Contenidos_Paginas.Add(record);
                }

                // Guardamos la nueva edición en la columna de Borrador / Stage serializando el nodo
                record.Contenido_Borrador_Stage = kvp.Value.GetRawText();
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Textos de '{pagina}' guardados exitosamente como Borrador." });
        }

        /// <summary>
        /// Reemplaza imágenes base64 embebidas por una URL placeholder para limpiar datos.
        /// </summary>
        [HttpGet("clean-base64")]
        public async Task<ActionResult> CleanBase64()
        {
            var contenidos = await _context.Contenidos_Paginas.ToListAsync();
            int count = 0;
            string regexPattern = @"data:image\/[^;]+;base64,[a-zA-Z0-9\+/=]+";
            string defaultImage = "https://blocks.astratic.com/img/general-img-landscape.png";

            foreach (var item in contenidos)
            {
                bool modified = false;

                if (!string.IsNullOrEmpty(item.Contenido_Borrador_Stage) && Regex.IsMatch(item.Contenido_Borrador_Stage, regexPattern, RegexOptions.IgnoreCase))
                {
                    item.Contenido_Borrador_Stage = Regex.Replace(item.Contenido_Borrador_Stage, regexPattern, defaultImage, RegexOptions.IgnoreCase);
                    modified = true;
                }

                if (!string.IsNullOrEmpty(item.Contenido_Publicado_Produccion) && Regex.IsMatch(item.Contenido_Publicado_Produccion, regexPattern, RegexOptions.IgnoreCase))
                {
                    item.Contenido_Publicado_Produccion = Regex.Replace(item.Contenido_Publicado_Produccion, regexPattern, defaultImage, RegexOptions.IgnoreCase);
                    modified = true;
                }

                if (modified) count++;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Se limpiaron {count} registros con base64." });
        }

        /// <summary>
        /// Publica contenido moviendo stage/borrador a producción.
        /// </summary>
        [HttpPost("/api/cms/deploy")]
        [Authorize]
        public async Task<ActionResult> DeployContent()
        {
            var contenidos = await _context.Contenidos_Paginas.ToListAsync();
            int count = 0;

            foreach (var item in contenidos)
            {
                if (!string.IsNullOrEmpty(item.Contenido_Borrador_Stage))
                {
                    item.Contenido_Publicado_Produccion = item.Contenido_Borrador_Stage;
                    count++;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = $"Se publicaron {count} bloques de contenido exitosamente." });
        }
    }
}
