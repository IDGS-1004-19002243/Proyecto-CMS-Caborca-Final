import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import homeService from '../api/homeService';
import { uploadImage } from '../api/uploadService';
import { settingsService } from '../api/settingsService';
import { authService } from '../api/auth';
import BotonesPublicar from '../componentes/BotonesPublicar';
import MapPickerPanel from '../componentes/MapPickerPanel';

// ── Mapa de ayuda por país (normalizado) ─────────────────────────────────────
const ADDR_HINTS = {
  default: {
    estado: { label: 'Estado / Provincia / Región', ph: 'Ej. Sonora' },
    ciudad: { label: 'Ciudad / Localidad', ph: 'Ej. Caborca' },
    colonia: { label: 'Colonia / Barrio / Suburbio', ph: 'Ej. Centro' },
    calle: { label: 'Calle / Dirección principal', ph: 'Ej. Av. Principal' },
    numeroExt: { label: 'Núm. exterior / Edificio', ph: 'Ej. 123' },
    numeroInt: { label: 'Núm. interior / Apto / Suite', ph: 'Ej. A' },
    cp: { label: 'Código postal', ph: 'Ej. 85000' },
    telefono: { label: 'Teléfono (con lada internacional)', ph: 'Ej. +52 662 123 4567' },
  },
  mx: {
    estado: { label: 'Estado', ph: 'Ej. Sonora' },
    ciudad: { label: 'Ciudad / Municipio', ph: 'Ej. Caborca' },
    colonia: { label: 'Colonia', ph: 'Ej. Centro' },
    calle: { label: 'Calle', ph: 'Ej. Av. Reforma' },
    numeroExt: { label: 'Número exterior', ph: 'Ej. 123' },
    numeroInt: { label: 'Número interior', ph: 'Ej. A' },
    cp: { label: 'Código postal (CP)', ph: 'Ej. 85000' },
    telefono: { label: 'Teléfono', ph: 'Ej. (662) 123-4567' },
  },
  us: {
    estado: { label: 'Estado (State)', ph: 'Ej. California' },
    ciudad: { label: 'Ciudad (City)', ph: 'Ej. Los Angeles' },
    colonia: { label: 'Barrio / Area (opcional)', ph: 'Ej. Downtown' },
    calle: { label: 'Dirección completa (Street address)', ph: 'Ej. 123 Main St' },
    numeroExt: { label: 'Suite / Apt — opcional', ph: 'Ej. Suite 4B' },
    numeroInt: { label: 'Núm. adicional — opcional', ph: '' },
    cp: { label: 'Zip Code', ph: 'Ej. 90001' },
    telefono: { label: 'Teléfono', ph: 'Ej. +1 (213) 555-0100' },
  },
  ca: {
    estado: { label: 'Provincia / Territorio', ph: 'Ej. Ontario' },
    ciudad: { label: 'Ciudad', ph: 'Ej. Toronto' },
    colonia: { label: 'Municipio / Barrio — opcional', ph: 'Ej. Scarborough' },
    calle: { label: 'Dirección (Street address)', ph: 'Ej. 456 King St W' },
    numeroExt: { label: 'Unidad / Suite — opcional', ph: 'Ej. Unit 3' },
    numeroInt: { label: 'Núm. adicional — opcional', ph: '' },
    cp: { label: 'Postal Code', ph: 'Ej. M5V 1J9' },
    telefono: { label: 'Teléfono', ph: 'Ej. +1 (416) 555-0100' },
  },
  jp: {
    estado: { label: 'Prefectura (都道府県)', ph: 'Ej. Tokyo-to' },
    ciudad: { label: 'Ciudad / Municipio (市区町村)', ph: 'Ej. Shinjuku-ku' },
    colonia: { label: 'Distrito / Cho (町・丁目)', ph: 'Ej. Kabukicho 1-chome' },
    calle: { label: 'Núm. de bloque / edificio', ph: 'Ej. 2-3, Edificio Sunshine' },
    numeroExt: { label: 'Número de piso — opcional', ph: 'Ej. 5F' },
    numeroInt: { label: 'Nombre edificio — opcional', ph: 'Ej. Sun Plaza' },
    cp: { label: 'Código postal (郵便番号)', ph: 'Ej. 160-0021' },
    telefono: { label: 'Teléfono', ph: 'Ej. +81 3-1234-5678' },
  },
  au: {
    estado: { label: 'Estado / Territorio', ph: 'Ej. New South Wales' },
    ciudad: { label: 'Suburbio / Ciudad (Suburb)', ph: 'Ej. Bondi' },
    colonia: { label: 'Barrio / Area — opcional', ph: 'Ej. Northern Beaches' },
    calle: { label: 'Dirección (Street address)', ph: 'Ej. 78 George St' },
    numeroExt: { label: 'Unidad / Villa — opcional', ph: 'Ej. Unit 2' },
    numeroInt: { label: 'Nombre edificio — opcional', ph: '' },
    cp: { label: 'Postcode', ph: 'Ej. 2026' },
    telefono: { label: 'Teléfono', ph: 'Ej. +61 2 9999 0000' },
  },
  gb: {
    estado: { label: 'Condado / Región (County)', ph: 'Ej. Greater London' },
    ciudad: { label: 'Ciudad / Localidad (Town/City)', ph: 'Ej. London' },
    colonia: { label: 'Zona / Barrio — opcional', ph: 'Ej. Mayfair' },
    calle: { label: 'Dirección (Street address)', ph: 'Ej. 10 Downing Street' },
    numeroExt: { label: 'Apto / Flat — opcional', ph: 'Ej. Flat 3B' },
    numeroInt: { label: 'Núm. adicional — opcional', ph: '' },
    cp: { label: 'Postcode', ph: 'Ej. SW1A 2AA' },
    telefono: { label: 'Teléfono', ph: 'Ej. +44 20 7946 0000' },
  },
  de: {
    estado: { label: 'Estado federal (Bundesland)', ph: 'Ej. Bayern' },
    ciudad: { label: 'Ciudad (Stadt)', ph: 'Ej. München' },
    colonia: { label: 'Distrito / Barrio (Stadtteil) — opcional', ph: 'Ej. Schwabing' },
    calle: { label: 'Calle y número (Straße + Hausnummer)', ph: 'Ej. Leopoldstr. 15' },
    numeroExt: { label: 'Apto / Etage — opcional', ph: 'Ej. 3. OG' },
    numeroInt: { label: 'Núm. timbre — opcional', ph: '' },
    cp: { label: 'Postleitzahl (PLZ)', ph: 'Ej. 80802' },
    telefono: { label: 'Teléfono', ph: 'Ej. +49 89 1234567' },
  },
  es: {
    estado: { label: 'Comunidad Autónoma / Provincia', ph: 'Ej. Cataluña' },
    ciudad: { label: 'Ciudad / Municipio', ph: 'Ej. Barcelona' },
    colonia: { label: 'Barrio / Distrito — opcional', ph: 'Ej. Gràcia' },
    calle: { label: 'Calle y número', ph: 'Ej. C/ Mayor, 10' },
    numeroExt: { label: 'Apto / Piso', ph: 'Ej. 3º A' },
    numeroInt: { label: 'Escalera — opcional', ph: 'Ej. Esc. 2' },
    cp: { label: 'Código Postal', ph: 'Ej. 08001' },
    telefono: { label: 'Teléfono', ph: 'Ej. +34 93 123 4567' },
  },
  br: {
    estado: { label: 'Estado (UF)', ph: 'Ej. São Paulo' },
    ciudad: { label: 'Cidade / Município', ph: 'Ej. São Paulo' },
    colonia: { label: 'Bairro (Barrio)', ph: 'Ej. Vila Mariana' },
    calle: { label: 'Logradouro e número (Calle + núm.)', ph: 'Ej. Rua Augusta, 500' },
    numeroExt: { label: 'Complemento — opcional', ph: 'Ej. Apto 32' },
    numeroInt: { label: 'Núm. adicional — opcional', ph: '' },
    cp: { label: 'CEP (Cód. postal)', ph: 'Ej. 01310-100' },
    telefono: { label: 'Telefone', ph: 'Ej. +55 11 91234-5678' },
  },
};

// Detecta clave de hints por nombre de país
/**
 * Resuelve textos de ayuda de dirección en función del país capturado.
 * @param {string} pais
 */
function getAddrHints(pais) {
  if (!pais) return ADDR_HINTS.default;
  const p = pais.toLowerCase();
  if (p.includes('méxico') || p.includes('mexico') || p.includes('mx')) return ADDR_HINTS.mx;
  if (p.includes('estados unidos') || p.includes('usa') || p.includes('united states') || p.includes('eeuu')) return ADDR_HINTS.us;
  if (p.includes('canad') || p.includes('canada')) return ADDR_HINTS.ca;
  if (p.includes('jap') || p.includes('japan') || p.includes('japon')) return ADDR_HINTS.jp;
  if (p.includes('australia') || p.includes('au')) return ADDR_HINTS.au;
  if (p.includes('reino unido') || p.includes('united kingdom') || p.includes('uk') || p.includes('gran bretaña')) return ADDR_HINTS.gb;
  if (p.includes('alemania') || p.includes('germany') || p.includes('deutschland')) return ADDR_HINTS.de;
  if (p.includes('españa') || p.includes('spain') || p.includes('espana')) return ADDR_HINTS.es;
  if (p.includes('brasil') || p.includes('brazil') || p.includes('br')) return ADDR_HINTS.br;
  return ADDR_HINTS.default;
}

/**
 * Página de configuración del CMS.
 * Centraliza contacto, redes, distribuidores, mantenimiento y seguridad.
 */
export default function Configuracion() {
  const { success, error: toastError } = useToast();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const seccionActiva = searchParams.get('tab') || 'contacto';
  
  const [guardando, setGuardando] = useState(false);
  const [idioma, setIdioma] = useState('es');

  // --- Seguridad ---
  const [passwordForm, setPasswordForm] = useState({ actual: '', nueva: '', confirmar: '' });
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [showPwd, setShowPwd] = useState({ actual: false, nueva: false, confirmar: false });

  const [scheduleDate, setScheduleDate] = useState('');

  const [adminUsers, setAdminUsers] = useState([]);
  const [targetUsername, setTargetUsername] = useState('');

  const currentUser = authService.getCurrentUser();
  const isSuperAdmin = currentUser?.rol === 'SuperAdmin' || currentUser?.usuario?.toLowerCase() === 'superadmin';

  useEffect(() => {

    const handler = (e) => {
      const l = e && e.detail && e.detail.lang;
      if (l) setIdioma(l);
    };
    try { const stored = localStorage.getItem('cms:editor:lang'); if (stored) setIdioma(stored); } catch (e) { }
    window.addEventListener('cms:editor:lang-changed', handler);
    return () => window.removeEventListener('cms:editor:lang-changed', handler);
  }, []);

  useEffect(() => {
    if (seccionActiva === 'seguridad' && isSuperAdmin) {
      const fetchUsers = async () => {
        try {
          const users = await authService.getAdminUsers();
          setAdminUsers(users);
          if (users.length > 0) {
            setTargetUsername(users[0].usuario);
          }
        } catch (err) {
          console.error("Failed to load users:", err);
        }
      };
      fetchUsers();
    }
  }, [seccionActiva, isSuperAdmin]);



  // Cambia contraseña del usuario seleccionado desde el panel de seguridad.
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.actual || !passwordForm.nueva || !passwordForm.confirmar) {
      toastError('Por favor completa todos los campos.');
      return;
    }
    if (passwordForm.nueva !== passwordForm.confirmar) {
      toastError('Las nuevas contraseñas no coinciden.');
      return;
    }
    setCambiandoPassword(true);
    try {
      await authService.changePassword(passwordForm.actual, passwordForm.nueva, targetUsername);
      success(`Contraseña actualizada correctamente para el usuario ${targetUsername || 'actual'}.`);
      setPasswordForm({ actual: '', nueva: '', confirmar: '' });
    } catch (error) {
      toastError(error.message || 'Error al cambiar la contraseña.');
    } finally {
      setCambiandoPassword(false);
    }
  };

  // --- Configuración General ---

  const [config, setConfig] = useState({
    general: {
      nombreSitio: 'Caborca Boots',
      descripcion: 'Botas artesanales de la más alta calidad',
      email: 'contacto@caborcaboots.com',
      telefono: '+52 662 123 4567',
      direccion: 'Av. Principal #123, Caborca, Sonora, México'
    },
    redesSociales: {
      instagram: { url: 'https://instagram.com/caborcaboots', show: true },
      facebook: { url: 'https://facebook.com/caborcaboots', show: true },
      twitter: { url: 'https://twitter.com/caborcaboots', show: false },
      email: { url: 'contacto@caborcaboots.com', show: true },
      youtube: { url: '', show: false },
      tiktok: { url: 'https://tiktok.com/@caborca', show: false }
    },
    emails: {
      contacto: ['contacto@caborca.com'],
      distribuidores: ['distribuidores@caborca.com']
    },
    distribuidoresMap: {
      mapTitle: 'Encuentra a nuestros distribuidores',
      mapText: 'Ubica los puntos de venta oficiales en el mapa',
      mapSrc: ''
    }
    ,
    distribuidoresList: []
  });

  // Guarda la configuración general del CMS y del sitio público.
  const guardarCambios = async () => {
    setGuardando(true);
    try {
      console.log('Guardando configuración:', config);
      await settingsService.updateConfiguracionGeneral(config);
      success('Configuración guardada correctamente');
    } catch (error) {
      toastError('Error al guardar configuración general');
    } finally {
      setGuardando(false);
    }
  };

  // Cargar configuración de la API al montar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await settingsService.getConfiguracionGeneral();
        if (data && Object.keys(data).length > 0) {
          setConfig(prev => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error('Error cargando configuración general', e);
      }
    };
    loadConfig();
  }, []);

  // Estados locales para formulario de distribuidores
  const [distribuidorForm, setDistribuidorForm] = useState({
    id: null,
    contactoNombre: '',
    negocioNombre: '',
    negocioNombre_EN: '',
    pais: '',
    estado: '',
    estado_EN: '',
    ciudad: '',
    ciudad_EN: '',
    colonia: '',
    calle: '',
    numeroExt: '',
    numeroInt: '',
    cp: '',
    direccion_EN: '',
    tipoVenta: '',
    sitioWeb: '',
    telefono: '',
    email: '',
    clasificacion: 'nacional',
    lat: '',
    lng: '',
    destacado: false,
    imagenes: []
  });
  const [editIndex, setEditIndex] = useState(null);
  const [distTab, setDistTab] = useState('formulario');
  const [guiaDireccion, setGuiaDireccion] = useState(false);
  const [mapPickerOpen, setMapPickerOpen] = useState(false); // toggle mapa picker

  const resetDistribuidorForm = () => setDistribuidorForm({
    id: null, contactoNombre: '', negocioNombre: '', negocioNombre_EN: '', pais: '', estado: '', estado_EN: '', ciudad: '', ciudad_EN: '', colonia: '', calle: '', numeroExt: '', numeroInt: '', cp: '', direccion_EN: '', tipoVenta: '', sitioWeb: '', telefono: '', email: '', clasificacion: 'nacional', lat: '', lng: '', destacado: false, imagenes: []
  });

  const saveDistribuidorLocal = async (list) => {
    try {
      setConfig(prev => {
        const updated = { ...prev, distribuidoresList: list };
        settingsService.updateConfiguracionGeneral(updated).catch(console.error);
        return updated;
      });
    } catch (e) { console.error(e) }
  };



  const handleAddOrUpdateDistribuidor = () => {
    const item = { ...distribuidorForm, id: distribuidorForm.id || Date.now() };
    let next = [];
    if (editIndex === null) {
      next = [...(config.distribuidoresList || []), item];
    } else {
      next = (config.distribuidoresList || []).map((d, i) => i === editIndex ? item : d);
    }
    setConfig(prev => ({ ...prev, distribuidoresList: next }));
    saveDistribuidorLocal(next);
    resetDistribuidorForm();
    setEditIndex(null);
  };

  const handleEditDistribuidor = (index) => {
    const d = config.distribuidoresList[index];
    if (!d) return;
    setDistribuidorForm({ ...d });
    setEditIndex(index);
    setDistTab('formulario'); // switch to form tab
  };

  const handleDeleteDistribuidor = (index) => {
    const next = (config.distribuidoresList || []).filter((_, i) => i !== index);
    setConfig(prev => ({ ...prev, distribuidoresList: next }));
    saveDistribuidorLocal(next);
    if (editIndex === index) { resetDistribuidorForm(); setEditIndex(null); }
  };

  const handleToggleDestacado = (index) => {
    const next = [...(config.distribuidoresList || [])];
    if (next[index]) {
      next[index] = { ...next[index], destacado: !next[index].destacado };
      setConfig(prev => ({ ...prev, distribuidoresList: next }));
      saveDistribuidorLocal(next);
    }
  };

  return (
    <>
      <BotonesPublicar onGuardar={guardarCambios} label="Guardar Cambios" />
      <div className="space-y-6">
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-sm p-6">

              {/* --- Unificado: Medios de Contacto y Emails --- */}
              {seccionActiva === 'contacto' && (
                <div className="space-y-12">

                  {/* 1. Medio de contacto */}
                  <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-caborca-cafe mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Sección: Medio de Contacto
                  </h4>

                  <p className="text-sm text-gray-600">Configura tu teléfono principal, y elige qué iconos sociales se muestran en el pie de página y página de contacto.</p>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
                    <h5 className="text-md font-semibold text-caborca-cafe mb-3 flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                       Teléfono Principal
                    </h5>
                    <input
                      type="text"
                      className="w-full md:w-1/2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none transition-colors"
                      value={config.general?.telefono || ''}
                      onChange={(e) => setConfig({ ...config, general: { ...config.general, telefono: e.target.value } })}
                      placeholder="Ej. +52 662 123 4567"
                    />
                    <p className="text-xs text-gray-500 mt-2">Este teléfono aparecerá automáticamente en las tarjetas de contacto.</p>
                  </div>

                  <h5 className="text-md font-semibold text-caborca-cafe mb-3">Redes Sociales y Email</h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(config.redesSociales).map(([red, data]) => (
                      <div key={red} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-700 capitalize">{red}</label>
                          <label className="inline-flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={!!data.show}
                              onChange={(e) => setConfig({
                                ...config,
                                redesSociales: { ...config.redesSociales, [red]: { ...data, show: e.target.checked } }
                              })}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-gray-500">Mostrar</span>
                          </label>
                        </div>

                        <div className="mt-2">
                          <input
                            type={red === 'email' ? 'email' : 'url'}
                            value={data.url || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              redesSociales: { ...config.redesSociales, [red]: { ...data, url: e.target.value } }
                            })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none transition-colors"
                            placeholder={red === 'email' ? 'correo@ejemplo.com' : `https://${red}.com/tu-cuenta`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>

                  {/* 2. Emails Contacto */}
                  <div className="space-y-6 border-t border-gray-200 pt-8">
                    <h4 className="text-lg font-semibold text-caborca-cafe mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Sección: Emails Contacto
                    </h4>
                    <p className="text-sm text-gray-600">Escribe una dirección de email por línea. Estos serán los destinatarios cuando se envíe el formulario de contacto.</p>
                    <textarea
                      rows={6}
                      value={(config.emails.contacto || []).join('\n')}
                      onChange={(e) => setConfig({ ...config, emails: { ...config.emails, contacto: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) } })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>

                  {/* 3. Emails Distribuidores */}
                  <div className="space-y-6 border-t border-gray-200 pt-8">
                    <h4 className="text-lg font-semibold text-caborca-cafe mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                      Sección: Emails Distribuidores
                    </h4>
                    <p className="text-sm text-gray-600">Escribe una dirección de email por línea. Estos serán los destinatarios cuando se envíe el formulario de distribuidores.</p>
                    <textarea
                      rows={6}
                      value={(config.emails.distribuidores || []).join('\n')}
                      onChange={(e) => setConfig({ ...config, emails: { ...config.emails, distribuidores: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) } })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Gestión Distribuidores */}
              {seccionActiva === 'distribuidores' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-caborca-cafe mb-1 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Sección: Gestión de Distribuidores
                  </h4>
                  <p className="text-sm text-gray-500 mb-2">Administra distribuidores validados. Registra lat/lng para que aparezcan en el mapa.</p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4 text-xs font-semibold text-yellow-800">
                    Editando en: {idioma === 'es' ? '🇲🇽 ESPAÑOL' : '🇺🇸 INGLÉS'}
                  </div>

                  {/* Sub-tabs */}
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      onClick={() => setDistTab('formulario')}
                      className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px ${distTab === 'formulario'
                        ? 'border-caborca-cafe text-caborca-cafe bg-caborca-cafe/5'
                        : 'border-transparent text-gray-500 hover:text-caborca-cafe hover:border-caborca-cafe/40'
                        }`}
                    >
                      {editIndex !== null ? '✎ Editar Distribuidor' : '＋ Agregar Distribuidor'}
                    </button>
                    <button
                      onClick={() => setDistTab('listado')}
                      className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px flex items-center gap-2 ${distTab === 'listado'
                        ? 'border-caborca-cafe text-caborca-cafe bg-caborca-cafe/5'
                        : 'border-transparent text-gray-500 hover:text-caborca-cafe hover:border-caborca-cafe/40'
                        }`}
                    >
                      Listado
                      {(config.distribuidoresList || []).length > 0 && (
                        <span className="bg-caborca-cafe text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {(config.distribuidoresList || []).length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* TAB: FORMULARIO */}
                  {distTab === 'formulario' && (
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-100 shadow-sm">
                      <h5 className="font-bold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
                        {editIndex === null
                          ? (<><svg className="w-4 h-4 text-caborca-cafe" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>Nuevo Distribuidor</>)
                          : (<><svg className="w-4 h-4 text-caborca-cafe" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>Editando: {distribuidorForm.negocioNombre || distribuidorForm.contactoNombre || 'Distribuidor'}</>)
                        }
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Imágenes de Distribuidor */}
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Imágenes</label>
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                              {(distribuidorForm.imagenes || []).map((img, idx) => (
                                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                                  <img src={img} alt={`img-${idx}`} className="object-cover w-full h-full" />
                                  <button 
                                    type="button" 
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5" 
                                    onClick={() => setDistribuidorForm({ ...distribuidorForm, imagenes: distribuidorForm.imagenes.filter((_, i) => i !== idx) })}
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-3">
                              <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files);
                                  if (files.length === 0) return;
                                  try {
                                    const uploadedUrls = await Promise.all(files.map(file => uploadImage(file)));
                                    setDistribuidorForm({ ...distribuidorForm, imagenes: [...(distribuidorForm.imagenes || []), ...uploadedUrls] });
                                  } catch(err) {
                                    toastError('Error al subir imágenes');
                                  }
                                }} 
                                className="hidden" 
                                id="dist-img-upload" 
                              />
                              <label 
                                htmlFor="dist-img-upload" 
                                className="px-4 py-2 bg-caborca-beige-suave text-caborca-cafe rounded-lg hover:bg-caborca-cafe hover:text-white transition-colors cursor-pointer text-sm font-semibold"
                              >
                                Subir imágenes
                              </label>
                            </div>
                          </div>
                        </div>


                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Clasificación</label>
                          <select value={distribuidorForm.clasificacion || 'nacional'} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, clasificacion: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Clasificación">
                            <option value="nacional">Nacional</option>
                            <option value="internacional">Internacional</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de venta</label>
                          <select value={distribuidorForm.tipoVenta} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, tipoVenta: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Tipo de venta">
                            <option value="">Seleccionar...</option>
                            <option value="tienda">Tienda física</option>
                            <option value="online">Venta en línea</option>
                            <option value="ambas">Ambas</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de contacto</label>
                          <input placeholder="Ej. Juan Pérez" value={distribuidorForm.contactoNombre} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, contactoNombre: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Nombre de contacto" />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del negocio</label>
                          <input placeholder="Ej. Zapatería López" value={distribuidorForm.negocioNombre} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, negocioNombre: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Nombre del negocio" />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del negocio en inglés</label>
                          <input placeholder="Ex. Lopez Boots Store" value={distribuidorForm.negocioNombre_EN || ''} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, negocioNombre_EN: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Business name in English" />
                        </div>

                        {/* País */}
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">País</label>
                          <input
                            placeholder="Ej. México, Japón, Australia..."
                            value={distribuidorForm.pais}
                            onChange={(e) => setDistribuidorForm({ ...distribuidorForm, pais: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none"
                            aria-label="País"
                          />
                          {/* Indicador de perfil de dirección activo */}
                          {distribuidorForm.pais && (() => {
                            const h = getAddrHints(distribuidorForm.pais);
                            const esDefault = h === ADDR_HINTS.default;
                            return !esDefault ? (
                              <p className="mt-1 text-xs text-caborca-cafe font-semibold">
                                ✅ Formato de dirección detectado. Los campos muestran etiquetas adaptadas.
                              </p>
                            ) : (
                              <p className="mt-1 text-xs text-gray-400">
                                País no detectado en la guía — usa etiquetas genéricas.
                              </p>
                            );
                          })()}
                        </div>

                        {/* Campos de dirección — adaptativos */}
                        {(() => {
                          const h = getAddrHints(distribuidorForm.pais);
                          return (
                            <>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{h.estado.label}</label>
                                <input placeholder={h.estado.ph} value={distribuidorForm.estado} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, estado: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Estado" />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{h.ciudad.label}</label>
                                <input placeholder={h.ciudad.ph} value={distribuidorForm.ciudad} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, ciudad: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Ciudad" />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{h.colonia.label}</label>
                                <input placeholder={h.colonia.ph} value={distribuidorForm.colonia} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, colonia: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Colonia" />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{h.calle.label}</label>
                                <input placeholder={h.calle.ph} value={distribuidorForm.calle} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, calle: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Calle" />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{h.numeroExt.label}</label>
                                <input placeholder={h.numeroExt.ph} value={distribuidorForm.numeroExt} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, numeroExt: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Número exterior" />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{h.numeroInt.label}</label>
                                <input placeholder={h.numeroInt.ph} value={distribuidorForm.numeroInt} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, numeroInt: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Número interior" />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{h.cp.label}</label>
                                <input placeholder={h.cp.ph} value={distribuidorForm.cp} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, cp: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Código postal" />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">{h.telefono.label}</label>
                                <input placeholder={h.telefono.ph} value={distribuidorForm.telefono} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, telefono: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Teléfono" />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado en inglés</label>
                                <input placeholder="Ex. California" value={distribuidorForm.estado_EN || ''} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, estado_EN: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="State in English" />
                              </div>

                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad en inglés</label>
                                <input placeholder="Ex. Los Angeles" value={distribuidorForm.ciudad_EN || ''} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, ciudad_EN: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="City in English" />
                              </div>

                              <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección para inglés (opcional)</label>
                                <input placeholder="Ex. 123 Main St, Los Angeles, California, 90001" value={distribuidorForm.direccion_EN || ''} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, direccion_EN: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Address in English" />
                              </div>
                            </>
                          );
                        })()}

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                          <input placeholder="correo@ejemplo.com" value={distribuidorForm.email} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Email" />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Sitio web</label>
                          <input placeholder="https://ejemplo.com" value={distribuidorForm.sitioWeb} onChange={(e) => setDistribuidorForm({ ...distribuidorForm, sitioWeb: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" aria-label="Sitio web" />
                        </div>

                        {/* Ubicación en Mapa */}
                        <div className="col-span-1 md:col-span-2">
                          <div className="border-2 border-caborca-cafe/30 rounded-xl overflow-hidden">
                            {/* Header toggle */}
                            <button
                              type="button"
                              onClick={() => setMapPickerOpen(o => !o)}
                              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${mapPickerOpen ? 'bg-caborca-cafe text-white' : 'bg-caborca-cafe/5 hover:bg-caborca-cafe/10 text-caborca-cafe'
                                }`}
                            >
                              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                              <div className="text-left flex-1">
                                <p className="text-sm font-bold">
                                  {mapPickerOpen ? 'Cerrar mapa' : '🗺️ Buscar ubicación en el mapa'}
                                </p>
                                {!mapPickerOpen && (
                                  <p className="text-xs opacity-70">Busca, haz clic y los datos de dirección se llenan automáticamente</p>
                                )}
                              </div>
                              <svg className={`w-4 h-4 transition-transform ${mapPickerOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {/* Mapa colapsable */}
                            {mapPickerOpen && (
                              <div className="p-4">
                                <MapPickerPanel
                                  lat={distribuidorForm.lat}
                                  lng={distribuidorForm.lng}
                                  onSelect={(data) => {
                                    setDistribuidorForm(prev => ({
                                      ...prev,
                                      ...Object.fromEntries(
                                        Object.entries(data).filter(([, v]) => v !== undefined && v !== '')
                                      ),
                                    }));
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Inputs manuales de respaldo */}
                          <div className="mt-3">
                            <p className="text-xs text-gray-400 mb-2">O ingresa las coordenadas manualmente:</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Latitud</label>
                                <input
                                  type="number" step="any"
                                  placeholder="Ej. 19.4326"
                                  value={distribuidorForm.lat}
                                  onChange={(e) => setDistribuidorForm({ ...distribuidorForm, lat: e.target.value })}
                                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-caborca-cafe focus:outline-none"
                                  aria-label="Latitud"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Longitud</label>
                                <input
                                  type="number" step="any"
                                  placeholder="Ej. -99.1332"
                                  value={distribuidorForm.lng}
                                  onChange={(e) => setDistribuidorForm({ ...distribuidorForm, lng: e.target.value })}
                                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-caborca-cafe focus:outline-none"
                                  aria-label="Longitud"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => { handleAddOrUpdateDistribuidor(); setDistTab('listado'); }}
                          className="px-6 py-2 bg-caborca-cafe text-white rounded-lg hover:bg-caborca-negro transition-colors font-bold flex items-center gap-2 shadow-md"
                        >
                          {editIndex === null ? (
                            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>Agregar</>
                          ) : (
                            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>Guardar cambios</>
                          )}
                        </button>
                        <button
                          onClick={() => { resetDistribuidorForm(); setEditIndex(null); }}
                          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          Limpiar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB: LISTADO */}
                  {distTab === 'listado' && (
                    <div>
                      {(config.distribuidoresList || []).length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <p className="text-gray-500 text-sm">No hay distribuidores registrados.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-caborca-cafe/5 border-b border-gray-200">
                                <th className="text-left px-4 py-3 text-xs font-bold text-caborca-cafe uppercase tracking-wider">Negocio</th>
                                <th className="text-left px-4 py-3 text-xs font-bold text-caborca-cafe uppercase tracking-wider hidden md:table-cell">Ubicación</th>
                                <th className="text-left px-4 py-3 text-xs font-bold text-caborca-cafe uppercase tracking-wider hidden md:table-cell">Tipo</th>
                                <th className="text-left px-4 py-3 text-xs font-bold text-caborca-cafe uppercase tracking-wider hidden lg:table-cell">Mapa</th>
                                <th className="text-center px-4 py-3 text-xs font-bold text-caborca-cafe uppercase tracking-wider">Destacado</th>
                                <th className="px-4 py-3 text-xs font-bold text-caborca-cafe uppercase tracking-wider">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {(config.distribuidoresList || []).map((d, i) => (
                                <tr key={d.id || i} className="hover:bg-gray-50 transition-colors">
                                  {/* Nombre */}
                                  <td className="px-4 py-3">
                                    <div className="font-semibold text-gray-800">{d.negocioNombre || '—'}</div>
                                    <div className="text-xs text-gray-400">{d.contactoNombre || ''}</div>
                                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${d.clasificacion === 'internacional' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                      }`}>{d.clasificacion || 'nacional'}</span>
                                  </td>
                                  {/* Ubicación */}
                                  <td className="px-4 py-3 hidden md:table-cell">
                                    <div className="text-gray-700">{[d.ciudad, d.estado].filter(Boolean).join(', ') || '—'}</div>
                                    <div className="text-xs text-gray-400">{d.pais || ''}</div>
                                  </td>
                                  {/* Tipo */}
                                  <td className="px-4 py-3 hidden md:table-cell">
                                    {d.tipoVenta && (
                                      <span className="inline-block text-xs px-2 py-1 bg-caborca-beige-suave text-caborca-cafe rounded-full font-semibold">
                                        {d.tipoVenta === 'tienda' ? '🏪 Tienda' : d.tipoVenta === 'online' ? '🌐 Online' : d.tipoVenta === 'ambas' ? '🏪🌐 Ambas' : d.tipoVenta}
                                      </span>
                                    )}
                                  </td>
                                  {/* Coord mapa */}
                                  <td className="px-4 py-3 hidden lg:table-cell">
                                    {d.lat && d.lng ? (
                                      <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
                                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        En mapa
                                      </span>
                                    ) : (
                                      <span className="text-xs text-red-400">Sin coords</span>
                                    )}
                                  </td>
                                  {/* Destacados */}
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      title={d.destacado ? 'Quitar destacado' : 'Marcar como destacado'}
                                      onClick={() => handleToggleDestacado(i)}
                                      className="transition-colors hover:scale-110"
                                    >
                                      {d.destacado ? (
                                        <svg className="w-6 h-6 text-yellow-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ) : (
                                        <svg className="w-6 h-6 text-gray-300 hover:text-yellow-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.05 10.101c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                                        </svg>
                                      )}
                                    </button>
                                  </td>
                                  {/* Acciones */}
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleEditDistribuidor(i)}
                                        className="p-1.5 bg-caborca-cafe text-white rounded hover:bg-caborca-negro transition-colors"
                                        title="Editar"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteDistribuidor(i)}
                                        className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        title="Eliminar"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              )}


              {/* Seguridad */}
              {seccionActiva === 'seguridad' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-caborca-cafe mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Sección: Seguridad
                  </h4>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                      <svg className="w-5 h-5 inline mr-1 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Ten cuidado al modificar estas opciones. Cambios incorrectos pueden afectar el acceso al sistema.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cambiar Contraseña</label>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      {/* Campo: Usuario a modificar */}
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Usuario</label>
                        <select
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none"
                          value={targetUsername}
                          onChange={(e) => setTargetUsername(e.target.value)}
                        >
                          {adminUsers.map(u => (
                            <option key={u.usuario} value={u.usuario}>{u.usuario} ({u.rol})</option>
                          ))}
                        </select>
                      </div>

                      {/* Campo: Contraseña actual */}
                      <div className="relative">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Tu contraseña actual (SuperAdmin)</label>
                        <input
                          type={showPwd.actual ? 'text' : 'password'}
                          placeholder="Contraseña actual"
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none"
                          value={passwordForm.actual}
                          onChange={(e) => setPasswordForm({ ...passwordForm, actual: e.target.value })}
                          required
                        />
                        <button type="button" onClick={() => setShowPwd(p => ({ ...p, actual: !p.actual }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-caborca-cafe transition-colors">
                          {showPwd.actual
                            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          }
                        </button>
                      </div>

                      {/* Campo: Nueva contraseña */}
                      <div className="relative">
                        <input
                          type={showPwd.nueva ? 'text' : 'password'}
                          placeholder="Nueva contraseña"
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none"
                          value={passwordForm.nueva}
                          onChange={(e) => setPasswordForm({ ...passwordForm, nueva: e.target.value })}
                          required
                        />
                        <button type="button" onClick={() => setShowPwd(p => ({ ...p, nueva: !p.nueva }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-caborca-cafe transition-colors">
                          {showPwd.nueva
                            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          }
                        </button>
                      </div>

                      {/* Campo: Confirmar contraseña */}
                      <div className="relative">
                        <input
                          type={showPwd.confirmar ? 'text' : 'password'}
                          placeholder="Confirmar nueva contraseña"
                          className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none"
                          value={passwordForm.confirmar}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmar: e.target.value })}
                          required
                        />
                        <button type="button" onClick={() => setShowPwd(p => ({ ...p, confirmar: !p.confirmar }))}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-caborca-cafe transition-colors">
                          {showPwd.confirmar
                            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          }
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={cambiandoPassword}
                        className="px-6 py-2 bg-caborca-cafe text-white rounded-lg hover:bg-caborca-negro flex items-center gap-2 disabled:opacity-50"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        {cambiandoPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                      </button>
                    </form>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
    </>
  );
}

