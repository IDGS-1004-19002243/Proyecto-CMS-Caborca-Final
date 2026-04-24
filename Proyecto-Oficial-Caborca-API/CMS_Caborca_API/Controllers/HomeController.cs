using CMS_Caborca_API.Data;
using CMS_Caborca_API.Models;
using CMS_Caborca_API.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace CMS_Caborca_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    /// <summary>
    /// Expone lectura/edición/publicación del contenido dinámico de Inicio.
    /// </summary>
    public class HomeController : ControllerBase
    {
        private readonly CaborcaContext _context;
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        // Claves en la tabla Contenidos_Paginas
        private const string KEY_CAROUSEL = "home_carousel";
        private const string KEY_FORM_DIST = "home_form_distribuidor";
        private const string KEY_SUSTENTABILIDAD = "home_sustentabilidad";
        private const string KEY_ARTE_CREACION = "home_arte_creacion";
        private const string KEY_DIST_LOGOS = "home_distribuidores_logos";
        private const string KEY_DONDE_COMPRAR = "home_donde_comprar";
        private const string KEY_PROD_DEST = "home_productos_destacados";

        /// <summary>
        /// Inicializa el controlador Home.
        /// </summary>
        /// <param name="context">Contexto de datos.</param>
        public HomeController(CaborcaContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Obtiene todo el contenido del Home consolidado en un DTO.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<HomeDto>> GetHomeContent()
        {
            var response = new HomeDto();

            // Si el header tiene token (CMS Admin), IsAuthenticated es true
            bool isCMS = User.Identity?.IsAuthenticated == true;

            var keys = new[] { KEY_CAROUSEL, KEY_FORM_DIST, KEY_SUSTENTABILIDAD, KEY_ARTE_CREACION, KEY_DIST_LOGOS, KEY_DONDE_COMPRAR, KEY_PROD_DEST,
                                // Compatibilidad con clave antigua "home_distribuidores"
                                "home_distribuidores" };
            var records = await _context.Contenidos_Paginas
                .Where(c => keys.Contains(c.Clave_Identificadora))
                .ToListAsync();

            string GetJson(string clave)
            {
                var rec = records.FirstOrDefault(c => c.Clave_Identificadora == clave);
                if (rec == null) return string.Empty;
                return isCMS
                    ? (rec.Contenido_Borrador_Stage ?? rec.Contenido_Publicado_Produccion ?? string.Empty)
                    : (rec.Contenido_Publicado_Produccion ?? string.Empty);
            }

            // 1. Carousel
            var jsonCar = GetJson(KEY_CAROUSEL);
            if (!string.IsNullOrEmpty(jsonCar))
                response.Carousel = JsonSerializer.Deserialize<List<HomeCarouselItemDto>>(jsonCar, _jsonOptions) ?? new();

            // 2. Form Distribuidor (primero busca clave nueva, si no la vieja)
            var jsonFormDist = GetJson(KEY_FORM_DIST);
            if (string.IsNullOrEmpty(jsonFormDist))
                jsonFormDist = GetJson("home_distribuidores"); // compatibilidad
            if (!string.IsNullOrEmpty(jsonFormDist))
                response.FormDistribuidor = JsonSerializer.Deserialize<HomeSeccionDto>(jsonFormDist, _jsonOptions) ?? new();

            // 3. Sustentabilidad
            var jsonSust = GetJson(KEY_SUSTENTABILIDAD);
            if (!string.IsNullOrEmpty(jsonSust))
                response.Sustentabilidad = JsonSerializer.Deserialize<HomeSeccionDto>(jsonSust, _jsonOptions) ?? new();

            // 4. Arte de la Creación
            var jsonArte = GetJson(KEY_ARTE_CREACION);
            if (!string.IsNullOrEmpty(jsonArte))
                response.ArteCreacion = JsonSerializer.Deserialize<HomeArteCreacionDto>(jsonArte, _jsonOptions) ?? new();

            // 5. Distribuidores Logos
            var jsonLogos = GetJson(KEY_DIST_LOGOS);
            if (!string.IsNullOrEmpty(jsonLogos))
                response.DistribuidoresLogos = JsonSerializer.Deserialize<HomeDistribuidoresLogosDto>(jsonLogos, _jsonOptions) ?? new();

            // 6. Dónde Comprar
            var jsonDonde = GetJson(KEY_DONDE_COMPRAR);
            if (!string.IsNullOrEmpty(jsonDonde))
                response.DondeComprar = JsonSerializer.Deserialize<HomeDondeComprarDto>(jsonDonde, _jsonOptions) ?? new();

            // 7. Productos Destacados
            var jsonProd = GetJson(KEY_PROD_DEST);
            if (!string.IsNullOrEmpty(jsonProd))
                response.ProductosDestacados = JsonSerializer.Deserialize<HomeProductosDestacadosDto>(jsonProd, _jsonOptions) ?? new();

            return Ok(response);
        }

        /// <summary>
        /// Guarda cambios del Home en stage/borrador.
        /// </summary>
        /// <param name="request">Payload completo del Home.</param>
        [HttpPut]
        [Authorize]
        public async Task<ActionResult> UpdateHomeContent([FromBody] HomeDto request)
        {
            // 1. Carousel
            var recCar = await GetOrCreateRecord("Inicio", "Carousel", KEY_CAROUSEL);
            recCar.Contenido_Borrador_Stage = JsonSerializer.Serialize(request.Carousel, _jsonOptions);

            // 2. Form Distribuidor
            var recFormDist = await GetOrCreateRecord("Inicio", "Form Dist.", KEY_FORM_DIST);
            recFormDist.Contenido_Borrador_Stage = JsonSerializer.Serialize(request.FormDistribuidor, _jsonOptions);

            // 3. Sustentabilidad
            var recSust = await GetOrCreateRecord("Inicio", "Sustentabilidad", KEY_SUSTENTABILIDAD);
            recSust.Contenido_Borrador_Stage = JsonSerializer.Serialize(request.Sustentabilidad, _jsonOptions);

            // 4. Arte de la Creación
            var recArte = await GetOrCreateRecord("Inicio", "Arte Creacion", KEY_ARTE_CREACION);
            recArte.Contenido_Borrador_Stage = JsonSerializer.Serialize(request.ArteCreacion, _jsonOptions);

            // 5. Distribuidores Logos
            var recLogos = await GetOrCreateRecord("Inicio", "Logos Dist.", KEY_DIST_LOGOS);
            recLogos.Contenido_Borrador_Stage = JsonSerializer.Serialize(request.DistribuidoresLogos, _jsonOptions);

            // 6. Dónde Comprar
            var recDonde = await GetOrCreateRecord("Inicio", "Dónde Comprar", KEY_DONDE_COMPRAR);
            recDonde.Contenido_Borrador_Stage = JsonSerializer.Serialize(request.DondeComprar, _jsonOptions);

            // 7. Productos Destacados
            var recProd = await GetOrCreateRecord("Inicio", "Productos Destacados", KEY_PROD_DEST);
            recProd.Contenido_Borrador_Stage = JsonSerializer.Serialize(request.ProductosDestacados, _jsonOptions);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Contenido guardado como BORRADOR. Usa 'Publicar' para verlo en el portafolio." });
        }

        /// <summary>
        /// Publica contenido de Home pasando stage a producción.
        /// </summary>
        [HttpPost("deploy")]
        [Authorize]
        public async Task<ActionResult> DeployHomeContent()
        {
            var keys = new[] { KEY_CAROUSEL, KEY_FORM_DIST, KEY_SUSTENTABILIDAD, KEY_ARTE_CREACION, KEY_DIST_LOGOS, KEY_DONDE_COMPRAR, KEY_PROD_DEST };
            var records = await _context.Contenidos_Paginas
                .Where(c => keys.Contains(c.Clave_Identificadora))
                .ToListAsync();

            foreach (var record in records)
            {
                if (!string.IsNullOrEmpty(record.Contenido_Borrador_Stage))
                {
                    record.Contenido_Publicado_Produccion = record.Contenido_Borrador_Stage;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "¡Contenido publicado! El portafolio ya muestra los últimos cambios." });
        }

        /// <summary>
        /// Obtiene o crea un registro de contenido por clave para la página Home.
        /// </summary>
        /// <param name="pagina">Nombre de página.</param>
        /// <param name="seccion">Sección funcional.</param>
        /// <param name="clave">Clave única del bloque.</param>
        /// <returns>Registro existente o recién creado.</returns>
        private async Task<Contenido_Pagina> GetOrCreateRecord(string pagina, string seccion, string clave)
        {
            var record = await _context.Contenidos_Paginas.FirstOrDefaultAsync(c => c.Clave_Identificadora == clave);
            if (record == null)
            {
                record = new Contenido_Pagina
                {
                    Nombre_Pagina = pagina,
                    Seccion_Pagina = seccion,
                    Clave_Identificadora = clave,
                    Tipo_De_Contenido = "json",
                    Contenido_Borrador_Stage = "",
                    Contenido_Publicado_Produccion = ""
                };
                _context.Contenidos_Paginas.Add(record);
            }
            return record;
        }
    }
}
