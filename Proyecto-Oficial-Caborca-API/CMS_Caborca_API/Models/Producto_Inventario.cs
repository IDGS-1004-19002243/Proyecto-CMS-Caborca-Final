using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS_Caborca_API.Models
{
    [Table("Productos_Inventario")]
    /// <summary>
    /// Entidad de inventario de producto publicable en catálogo.
    /// </summary>
    public class Producto_Inventario
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        /// <summary>Identificador único del producto.</summary>
        public int Id { get; set; }

        [Required]
        /// <summary>Llave foránea hacia la categoría del producto.</summary>
        public int Id_Categoria { get; set; }

        [Required]
        [MaxLength(150)]
        /// <summary>Nombre del producto en español.</summary>
        public string Nombre_ES { get; set; } = null!;

        [Required]
        [MaxLength(150)]
        /// <summary>Nombre del producto en inglés.</summary>
        public string Nombre_EN { get; set; } = null!;

        [Required]
        /// <summary>Descripción comercial en español.</summary>
        public string Descripcion_ES { get; set; } = null!;

        [Required]
        /// <summary>Descripción comercial en inglés.</summary>
        public string Descripcion_EN { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        /// <summary>Precio de venta del producto.</summary>
        public decimal Precio { get; set; }

        /// <summary>Indica si el producto se muestra como destacado.</summary>
        public bool Es_Destacado { get; set; }

        [Required]
        [MaxLength(50)]
        /// <summary>Estado editorial/publicación (Borrador, Publicado, etc.).</summary>
        public string Estado_Publicacion { get; set; } = "Borrador"; // Ej: "Borrador", "Publicado"

        // Navegación
        [ForeignKey(nameof(Id_Categoria))]
        /// <summary>Navegación a la categoría asociada.</summary>
        public virtual Categoria_Producto Categoria { get; set; } = null!;

        /// <summary>Colección de imágenes del producto.</summary>
        public virtual ICollection<Imagen_De_Producto> Imagenes { get; set; } = new List<Imagen_De_Producto>();
    }
}
