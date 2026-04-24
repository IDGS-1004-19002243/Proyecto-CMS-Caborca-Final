using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS_Caborca_API.Controllers
{
    /// <summary>
    /// Controlador encargado de la gestión y almacenamiento de archivos multimedia.
    /// Configurado para almacenamiento local en el servidor dentro de la carpeta wwwroot.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        /// <summary>
        /// Procesa la subida de una imagen y devuelve la ruta pública de acceso.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No se ha seleccionado ningún archivo.");

            try
            {
                // Definir la ruta de almacenamiento dentro de wwwroot
                string uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                
                // Asegurar que el directorio de destino existe
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generar un nombre de archivo único para evitar colisiones
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Persistir el archivo en el sistema de archivos del servidor
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                // Construir la ruta relativa para el acceso público
                // Retornar URL ABSOLUTA para arreglar renders en el frontend sin prefijos
                string baseUrl = $"{Request.Scheme}://{Request.Host}";
                string fileUrl = $"{baseUrl}/uploads/{uniqueFileName}";
                
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno al procesar el archivo: {ex.Message}");
            }
        }
    }
}
