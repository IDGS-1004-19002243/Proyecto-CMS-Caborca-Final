import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Secciones del Sitio (Vistas Principales)
import Inicio from './paginas/Inicio';
import CatalogoHombre from './paginas/CatalogoHombre';
import CatalogoMujer from './paginas/CatalogoMujer';
import Nosotros from './paginas/Nosotros';
import ResponsabilidadAmbiental from './paginas/ResponsabilidadAmbiental';
import Distribuidores from './paginas/Distribuidores';
import Contacto from './paginas/Contacto';
import DetalleProducto from './paginas/DetalleProducto';
import NotFound from './paginas/NotFound';
import EnConstruccion from './paginas/EnConstruccion';
import { API_URL } from './api/config';

/**
 * Componente Principal de la Aplicación.
 * Orquestador de rutas y gestor del estado global inicial (Modo Mantenimiento).
 */
function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    /**
     * Verifica si el sistema se encuentra en modo mantenimiento 
     * consultando la configuración global desde la API.
     */
    const checkMaintenance = async () => {
      try {
        const response = await fetch(`${API_URL}/Settings/Mantenimiento`);
        const data = await response.json();
        
        // Bloquear acceso al sitio si el flag de mantenimiento está activo
        if (data && data.activo) {
          setIsMaintenance(true);
        }
      } catch (error) {
        console.error('Falla en la verificación del estado del servidor:', error);
      } finally {
        setLoadingConfig(false);
      }
    };
    
    checkMaintenance();
  }, []);

  // Visualización del loader mientras se recupera la configuración inicial
  if (loadingConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#5C4A3A]"></div>
      </div>
    );
  }

  // Comportamiento para Modo Mantenimiento activado
  if (isMaintenance) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<EnConstruccion />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Inicio del Sitio */}
        <Route path="/" element={<Inicio />} />

        {/* Módulos de Catálogo y E-Commerce */}
        <Route path="/catalogo/hombre" element={<CatalogoHombre />} />
        <Route path="/catalogo/mujer" element={<CatalogoMujer />} />
        <Route path="/producto/:catalogo/:id" element={<DetalleProducto />} />

        {/* Módulos Corporativos e Informativos */}
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/responsabilidad-ambiental" element={<ResponsabilidadAmbiental />} />
        <Route path="/distribuidores" element={<Distribuidores />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Redirecciones Legadas (SEO & UX Support) */}
        <Route path="/catalogo-hombre" element={<Navigate to="/catalogo/hombre" replace />} />
        <Route path="/catalogo-mujer" element={<Navigate to="/catalogo/mujer" replace />} />
        <Route path="/detalle-producto" element={<DetalleProducto />} />

        {/* Páginas de Error y Estado */}
        <Route path="/mantenimiento" element={<EnConstruccion />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
