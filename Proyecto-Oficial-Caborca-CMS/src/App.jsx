import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';

// Módulo de Autenticación
import Login from './paginas/Login';
import LayoutAdmin from './componentes/LayoutAdmin';

// Módulos de Gestión de Contenido (CMS)
import EditarInicio from './paginas/EditarInicio';
import EditarNosotros from './paginas/EditarNosotros';
import EditarContacto from './paginas/EditarContacto';
import CatalogoHombre from './paginas/CatalogoHombre';
import CatalogoMujer from './paginas/CatalogoMujer';
import EditarResponsabilidad from './paginas/EditarResponsabilidad';
import EditarDistribuidores from './paginas/EditarDistribuidores';

// Módulos de Configuración de Sistema
import Configuracion from './paginas/Configuracion';
import EditarMantenimiento from './paginas/EditarMantenimiento';
import EditarNotFound from './paginas/EditarNotFound';

/**
 * Middleware de protección de rutas (HOC).
 * Verifica la existencia de un token de sesión antes de conceder acceso al panel.
 */
function RutaProtegida({ children }) {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Aplicación Central CMS - Caborca Boots.
 * Define la jerarquía de rutas protegidas y la inyección de proveedores de contexto.
 */
function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Puerta de enlace segura */}
          <Route path="/login" element={<Login />} />

          {/* Rutas de Administración (Requieren Autenticación) */}
          <Route
            path="/"
            element={
              <RutaProtegida>
                <LayoutAdmin />
              </RutaProtegida>
            }
          >
            {/* Redirección inicial al tablero de control */}
            <Route index element={<Navigate to="/editar-inicio" replace />} />
            
            {/* Gestión Transaccional de Contenido */}
            <Route path="editar-inicio" element={<EditarInicio />} />
            <Route path="editar-nosotros" element={<EditarNosotros />} />
            <Route path="editar-contacto" element={<EditarContacto />} />
            <Route path="editar-catalogo-hombre" element={<CatalogoHombre />} />
            <Route path="editar-catalogo-mujer" element={<CatalogoMujer />} />
            <Route path="editar-responsabilidad" element={<EditarResponsabilidad />} />
            <Route path="editar-distribuidores" element={<EditarDistribuidores />} />

            {/* Configuración Global y Estado de Sitio */}
            <Route path="editar-configuracion" element={<Configuracion />} />
            <Route path="editar-mantenimiento" element={<EditarMantenimiento />} />
            <Route path="editar-notfound" element={<EditarNotFound />} />
          </Route>

          {/* Manejo de rutas no definidas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
