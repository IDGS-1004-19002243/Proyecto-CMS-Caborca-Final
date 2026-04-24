using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS_Caborca_API.Models
{
    [Table("Contenidos_Paginas")]
    /// <summary>
    /// Bloque de contenido editable por página/sección en CMS.
    /// </summary>
    public class Contenido_Pagina
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        /// <summary>Identificador único del bloque de contenido.</summary>
        public int Id_Contenido { get; set; }

        [Required]
        [MaxLength(100)]
        /// <summary>Nombre lógico de página (por ejemplo: Inicio, Nosotros).</summary>
        public string Nombre_Pagina { get; set; } = null!; // Ej: 'Inicio', 'Nosotros'

        [Required]
        [MaxLength(100)]
        /// <summary>Sección funcional dentro de la página.</summary>
        public string Seccion_Pagina { get; set; } = null!; // Ej: 'Banner', 'Directorio'

        [Required]
        [MaxLength(200)]
        /// <summary>Clave técnica única del bloque en la base de datos.</summary>
        public string Clave_Identificadora { get; set; } = null!; // Ej: 'inicio_titulo_banner' (Unique Key se configura en Context)

        /// <summary>Contenido en etapa de borrador para edición CMS.</summary>
        public string? Contenido_Borrador_Stage { get; set; } // Lo que el CMS edita

        /// <summary>Contenido publicado consumido por el frontend público.</summary>
        public string? Contenido_Publicado_Produccion { get; set; } // Lo que lee el Frontend público

        [Required]
        [MaxLength(50)]
        /// <summary>Tipo de contenido del bloque (texto, json, imagen_url, etc.).</summary>
        public string Tipo_De_Contenido { get; set; } = "texto"; // 'texto' o 'imagen_url'
    }
}
