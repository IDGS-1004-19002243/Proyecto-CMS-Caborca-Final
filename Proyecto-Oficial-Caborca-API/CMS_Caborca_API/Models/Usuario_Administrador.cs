using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS_Caborca_API.Models
{
    [Table("Usuarios_Administradores")]
    /// <summary>
    /// Usuario administrador con permisos para operar el CMS.
    /// </summary>
    public class Usuario_Administrador
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        /// <summary>Identificador único del usuario administrador.</summary>
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        /// <summary>Nombre de usuario para autenticación.</summary>
        public string Usuario { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        /// <summary>Hash de contraseña almacenado de forma segura.</summary>
        public string PasswordHash { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        /// <summary>Rol de autorización (Admin, Editor, etc.).</summary>
        public string Rol { get; set; } = "Admin"; // Ej: "Admin", "Editor"

        /// <summary>Token de la última sesión registrada.</summary>
        public string? Token_Ultima_Sesion { get; set; }
    }
}
