using System;
using System.Collections.Generic;
using CMS_Caborca_API.Models;
using Microsoft.EntityFrameworkCore;

namespace CMS_Caborca_API.Data;

/// <summary>
/// Contexto EF Core principal del CMS Caborca.
/// </summary>
public partial class CaborcaContext : DbContext
{
    /// <summary>
    /// Constructor sin parámetros usado por tooling y serialización.
    /// </summary>
    public CaborcaContext()
    {
    }

    /// <summary>
    /// Constructor principal con opciones de contexto.
    /// </summary>
    /// <param name="options">Opciones de configuración EF Core.</param>
    public CaborcaContext(DbContextOptions<CaborcaContext> options)
        : base(options)
    {
    }

    // --- NUEVAS ENTIDADES (PROPUESTA V1) ---
    /// <summary>Contenido editable por página y sección.</summary>
    public virtual DbSet<Contenido_Pagina> Contenidos_Paginas { get; set; } = null!;
    /// <summary>Configuraciones globales del sistema.</summary>
    public virtual DbSet<Configuracion_Del_Sistema> Configuraciones_Del_Sistema { get; set; } = null!;
    /// <summary>Categorías disponibles para productos.</summary>
    public virtual DbSet<Categoria_Producto> Categorias_Productos { get; set; } = null!;
    /// <summary>Inventario de productos del catálogo.</summary>
    public virtual DbSet<Producto_Inventario> Productos_Inventario { get; set; } = null!;
    /// <summary>Imágenes asociadas a productos.</summary>
    public virtual DbSet<Imagen_De_Producto> Imagenes_De_Productos { get; set; } = null!;
    /// <summary>Tiendas y distribuidores registrados.</summary>
    public virtual DbSet<Tienda_Y_Distribuidor> Tiendas_Y_Distribuidores { get; set; } = null!;
    /// <summary>Configuración SMTP/correo.</summary>
    public virtual DbSet<Configuracion_De_Correo> Configuraciones_De_Correos { get; set; } = null!;
    /// <summary>Prospectos capturados desde formularios públicos.</summary>
    public virtual DbSet<Prospecto_Recibido> Prospectos_Recibidos { get; set; } = null!;
    /// <summary>Usuarios administradores del CMS.</summary>
    public virtual DbSet<Usuario_Administrador> Usuarios_Administradores { get; set; } = null!;

    /// <summary>
    /// Define configuración de modelo y restricciones adicionales.
    /// </summary>
    /// <param name="modelBuilder">Constructor de modelo EF Core.</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Unique Key para Contenidos_Paginas (Composite Index: Nombre_Pagina + Clave_Identificadora)
        modelBuilder.Entity<Contenido_Pagina>()
            .HasIndex(c => new { c.Nombre_Pagina, c.Clave_Identificadora })
            .IsUnique();

        OnModelCreatingPartial(modelBuilder);
    }

    /// <summary>
    /// Punto de extensión parcial para configurar entidades.
    /// </summary>
    /// <param name="modelBuilder">Constructor de modelo EF Core.</param>
    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
