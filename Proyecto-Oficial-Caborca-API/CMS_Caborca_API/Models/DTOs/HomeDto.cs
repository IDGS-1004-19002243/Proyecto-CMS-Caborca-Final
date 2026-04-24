namespace CMS_Caborca_API.Models.DTOs
{
    /// <summary>
    /// DTO agregador del contenido dinámico de la página de inicio.
    /// </summary>
    public class HomeDto
    {
        // Carousel Principal
        /// <summary>Slides del carrusel principal.</summary>
        public List<HomeCarouselItemDto> Carousel { get; set; } = new();

        // Sección "¿Quieres ser distribuidor?" (formulario)
        /// <summary>Sección de formulario para nuevos distribuidores.</summary>
        public HomeSeccionDto FormDistribuidor { get; set; } = new();

        // Sección "Sustentabilidad" (banner izquierdo)
        /// <summary>Bloque de sustentabilidad en el Home.</summary>
        public HomeSeccionDto Sustentabilidad { get; set; } = new();

        // Sección "Arte de la Creación" (Nosotros)
        /// <summary>Sección editorial "Arte de la Creación".</summary>
        public HomeArteCreacionDto ArteCreacion { get; set; } = new();

        // Sección "Distribuidores Autorizados" (logos)
        /// <summary>Sección de logos de distribuidores autorizados.</summary>
        public HomeDistribuidoresLogosDto DistribuidoresLogos { get; set; } = new();

        // Sección "Dónde Comprar"
        /// <summary>Sección informativa "Dónde Comprar".</summary>
        public HomeDondeComprarDto DondeComprar { get; set; } = new();

        // Sección "Productos Destacados"
        /// <summary>Título/configuración de productos destacados.</summary>
        public HomeProductosDestacadosDto ProductosDestacados { get; set; } = new();
    }

    // ─── Carousel ───────────────────────────────────────────────────────────────
    /// <summary>
    /// Slide individual del carrusel principal.
    /// </summary>
    public class HomeCarouselItemDto
    {
        /// <summary>Identificador del slide.</summary>
        public int Id { get; set; }
        /// <summary>Título en español.</summary>
        public string Titulo_ES { get; set; } = string.Empty;
        /// <summary>Título en inglés.</summary>
        public string Titulo_EN { get; set; } = string.Empty;
        /// <summary>Subtítulo en español.</summary>
        public string Subtitulo_ES { get; set; } = string.Empty;
        /// <summary>Subtítulo en inglés.</summary>
        public string Subtitulo_EN { get; set; } = string.Empty;
        /// <summary>Texto del botón en español.</summary>
        public string TextoBoton_ES { get; set; } = string.Empty;
        /// <summary>Texto del botón en inglés.</summary>
        public string TextoBoton_EN { get; set; } = string.Empty;
        /// <summary>URL de destino del botón.</summary>
        public string LinkBoton { get; set; } = string.Empty;
        /// <summary>URL de imagen del slide.</summary>
        public string ImagenUrl { get; set; } = string.Empty;
        /// <summary>Orden de despliegue en el carrusel.</summary>
        public int Orden { get; set; }
        /// <summary>Indica si el título se muestra en frontend.</summary>
        public bool MostrarTitulo { get; set; } = true;
        /// <summary>Indica si el subtítulo se muestra en frontend.</summary>
        public bool MostrarSubtitulo { get; set; } = true;
    }

    // ─── Sección genérica ampliada ───────────────────────────────────────────────
    /// <summary>
    /// DTO genérico para bloques de Home con contenido bilingüe.
    /// </summary>
    public class HomeSeccionDto
    {
        public string Titulo_ES { get; set; } = string.Empty;
        public string Titulo_EN { get; set; } = string.Empty;
        public string Subtitulo_ES { get; set; } = string.Empty;
        public string Subtitulo_EN { get; set; } = string.Empty;
        public string Descripcion_ES { get; set; } = string.Empty;
        public string Descripcion_EN { get; set; } = string.Empty;
        public string Mensaje_ES { get; set; } = string.Empty;
        public string Mensaje_EN { get; set; } = string.Empty;
        public string TextoBoton_ES { get; set; } = string.Empty;
        public string TextoBoton_EN { get; set; } = string.Empty;
        public string LinkBoton { get; set; } = string.Empty;
        public string ImagenUrl { get; set; } = string.Empty;
        // Campos extras para Sustentabilidad
        public string Badge_ES { get; set; } = string.Empty;
        public string Badge_EN { get; set; } = string.Empty;
        public string TituloDerecho_ES { get; set; } = string.Empty;
        public string TituloDerecho_EN { get; set; } = string.Empty;
        public string NotaCertificacion_ES { get; set; } = string.Empty;
        public string NotaCertificacion_EN { get; set; } = string.Empty;
        // Campos extras para FormDistribuidor
        public string NotaTiempo_ES { get; set; } = string.Empty;
        public string NotaTiempo_EN { get; set; } = string.Empty;
        public string StatDistribuidores_ES { get; set; } = string.Empty;
        public string StatDistribuidores_EN { get; set; } = string.Empty;
        public string StatEstados_ES { get; set; } = string.Empty;
        public string StatEstados_EN { get; set; } = string.Empty;
        public string StatDistribuidores { get; set; } = string.Empty; // Legacy
        public string StatEstados { get; set; } = string.Empty; // Legacy
        // Permite lista opcional de features
        /// <summary>Lista opcional de features de la sección.</summary>
        public List<HomeFeatureDto> Features { get; set; } = new();
    }

    // ─── Arte de la Creación ────────────────────────────────────────────────────
    /// <summary>
    /// DTO de la sección editorial "Arte de la Creación".
    /// </summary>
    public class HomeArteCreacionDto
    {
        public string Badge_ES { get; set; } = string.Empty;
        public string Badge_EN { get; set; } = string.Empty;
        public string Titulo_ES { get; set; } = string.Empty;
        public string Titulo_EN { get; set; } = string.Empty;
        public int AnosExperiencia { get; set; } = 40;
        public string TextoAnos_ES { get; set; } = "AÑOS";
        public string TextoAnos_EN { get; set; } = "YEARS";
        public string ImagenUrl { get; set; } = string.Empty;
        public string Boton_ES { get; set; } = string.Empty;
        public string Boton_EN { get; set; } = string.Empty;
        public string Nota_ES { get; set; } = string.Empty;
        public string Nota_EN { get; set; } = string.Empty;
        /// <summary>Features asociadas a la sección.</summary>
        public List<HomeFeatureDto> Features { get; set; } = new();
    }

    /// <summary>
    /// Feature textual bilingüe de secciones Home.
    /// </summary>
    public class HomeFeatureDto
    {
        public string Titulo_ES { get; set; } = string.Empty;
        public string Titulo_EN { get; set; } = string.Empty;
        public string Descripcion_ES { get; set; } = string.Empty;
        public string Descripcion_EN { get; set; } = string.Empty;
    }

    // ─── Distribuidores Logos ───────────────────────────────────────────────────
    /// <summary>
    /// DTO para sección de logos de distribuidores.
    /// </summary>
    public class HomeDistribuidoresLogosDto
    {
        public string Titulo_ES { get; set; } = string.Empty;
        public string Titulo_EN { get; set; } = string.Empty;
        public string Subtitulo_ES { get; set; } = string.Empty;
        public string Subtitulo_EN { get; set; } = string.Empty;
        public string TextoBoton_ES { get; set; } = string.Empty;
        public string TextoBoton_EN { get; set; } = string.Empty;
        /// <summary>Colección de logos a mostrar.</summary>
        public List<HomeDistribuidorLogoItemDto> Logos { get; set; } = new();
    }

    /// <summary>
    /// Item individual de logo de distribuidor.
    /// </summary>
    public class HomeDistribuidorLogoItemDto
    {
        /// <summary>Identificador de logo.</summary>
        public int Id { get; set; }
        /// <summary>URL de imagen de logo.</summary>
        public string ImagenUrl { get; set; } = string.Empty;
    }

    // ─── Dónde Comprar ────────────────────────────────────────────────────────
    /// <summary>
    /// DTO de la sección "Dónde Comprar" del Home.
    /// </summary>
    public class HomeDondeComprarDto
    {
        public string Titulo_ES { get; set; } = string.Empty;
        public string Titulo_EN { get; set; } = string.Empty;
        public string Descripcion_ES { get; set; } = string.Empty;
        public string Descripcion_EN { get; set; } = string.Empty;
        public string TextoBoton_ES { get; set; } = string.Empty;
        public string TextoBoton_EN { get; set; } = string.Empty;
        public string MapaUrl { get; set; } = string.Empty;
        public string Nota_ES { get; set; } = string.Empty;
        public string Nota_EN { get; set; } = string.Empty;
    }

    // ─── Productos Destacados ────────────────────────────────────────────────
    /// <summary>
    /// DTO para configuración de encabezado de productos destacados.
    /// </summary>
    public class HomeProductosDestacadosDto
    {
        /// <summary>Título en español.</summary>
        public string Titulo_ES { get; set; } = string.Empty;
        /// <summary>Título en inglés.</summary>
        public string Titulo_EN { get; set; } = string.Empty;
    }
}