using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS_Caborca_API.Models
{
    [Table("Categorias_Productos")]
    /// <summary>
    /// Categoría de clasificación para productos del catálogo.
    /// </summary>
    public class Categoria_Producto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        /// <summary>Identificador único de categoría.</summary>
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        /// <summary>Nombre de categoría en español.</summary>
        public string Nombre_ES { get; set; } = null!;

        [Required]
        [MaxLength(100)]
        /// <summary>Nombre de categoría en inglés.</summary>
        public string Nombre_EN { get; set; } = null!;

        [Required]
        [MaxLength(150)]
        /// <summary>Slug para URLs amigables.</summary>
        public string Slug { get; set; } = null!; // Para URLs amigables (ej. 'botas-vaqueras')

        // Propiedad de navegación
        /// <summary>Productos que pertenecen a esta categoría.</summary>
        public virtual ICollection<Producto_Inventario> Productos { get; set; } = new List<Producto_Inventario>();
    }
}
