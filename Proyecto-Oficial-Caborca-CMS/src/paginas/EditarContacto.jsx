import { useState, useRef, useEffect } from 'react'
import Header from '../componentes/Header'
import Footer from '../componentes/Footer'
import EditButton from '../componentes/EditButton'
import BotonesPublicar from '../componentes/BotonesPublicar'
import { useToast } from '../context/ToastContext'
import { textosService } from '../api/textosService'
import { uploadImage } from '../api/uploadService'
import { useOutletContext } from 'react-router-dom'
import { settingsService } from '../api/settingsService'

const socialIconsSVG = {
  instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>,
  tiktok: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" /></svg>,
  facebook: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
  twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  youtube: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 00-2.122 2.136C0 8.082 0 12 0 12s0 3.918.498 5.814a3.016 3.016 0 002.122 2.136C4.495 20.5 12 20.5 12 20.5s7.505 0 9.377-.55a3.016 3.016 0 002.122-2.136C24 15.918 24 12 24 12s0-3.918-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
};

/**
 * Editor CMS de la página de contacto.
 * Gestiona hero, tarjetas de contacto, formulario y secciones auxiliares por idioma.
 */
export default function EditarContacto() {
  const { success, error: toastError } = useToast();
  const { lang: idioma = 'es' } = useOutletContext();
  const [socials, setSocials] = useState(null);
  const [generalConfig, setGeneralConfig] = useState(null);

  // Relaciona cada tarjeta de contacto con su icono visual.
  const iconoPorCard = (id) => {
    if (id === 'telefono') return (
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    );
    if (id === 'email') return (
       <>
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
       </>
    );
    if (id === 'ubicacion') return (
       <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    );
    return (
       <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    );
  };

  useEffect(() => {
    settingsService.getConfiguracionGeneral().then(data => {
      if (data) {
        if (data.redesSociales) setSocials(data.redesSociales);
        if (data.general) setGeneralConfig(data.general);
      }
    }).catch(console.error);
  }, []);

  const [info, setInfo] = useState({
    telefono: '+52 123 456 789',
    email: 'contacto@caborcaboots.com',
    direccion: 'Caborca, Sonora, México',
    horario: 'Lun - Vie: 9:00 AM - 6:00 PM',
    mapaUrl: ''
  })

  const [formPreview, setFormPreview] = useState({
    titulo_ES: 'Envíanos un mensaje',
    titulo_EN: 'Send us a message',
    descripcion_ES: 'Completa el formulario y nos pondremos en contacto contigo',
    descripcion_EN: 'Complete the form and we will get in touch with you',
    titulo: '', descripcion: ''
  })

  const [seccionAyuda, setSeccionAyuda] = useState({
    titulo_ES: '¿Cómo podemos ayudarte?',
    titulo_EN: 'How can we help you?',
    subtitulo_ES: 'Nuestro equipo está listo para responder todas tus preguntas sobre nuestros productos, servicios o cualquier consulta que tengas.',
    subtitulo_EN: 'Our team is ready to answer all your questions about our products, services or any inquiry you may have.'
  })

  const [seccionMapa, setSeccionMapa] = useState({
    titulo_ES: 'Encuéntranos en el mapa',
    titulo_EN: 'Find us on the map',
    subtitulo_ES: 'Visita nuestras tiendas y distribuidores autorizados en todo México.',
    subtitulo_EN: 'Visit our stores and authorized distributors throughout Mexico.'
  })

  const [hero, setHero] = useState({
    badge_ES: 'ESTAMOS AQUÍ PARA TI',
    badge_EN: 'WE ARE HERE FOR YOU',
    titulo_ES: 'Contacto',
    titulo_EN: 'Contact',
    subtitulo_ES: 'Nos encantaría saber de ti. Completa el formulario y nos pondremos en contacto contigo',
    subtitulo_EN: 'We would love to hear from you. Fill out the form and we will get in touch with you',
    imagen: 'https://blocks.astratic.com/img/general-img-landscape.png',
    badge: '', titulo: '', subtitulo: ''
  })

  const [editarHero, setEditarHero] = useState(false)
  const [editarInfo, setEditarInfo] = useState(false)
  const [editarForm, setEditarForm] = useState(false)
  const [editarAyuda, setEditarAyuda] = useState(false)
  const [editarMapa, setEditarMapa] = useState(false)

  const [cards, setCards] = useState([
    { id: 'telefono', title_ES: 'Teléfono', title_EN: 'Phone', lines_ES: ['+52 (555) 123-4567', 'Lun - Vie: 9:00 AM - 6:00 PM'], lines_EN: ['+52 (555) 123-4567', 'Mon - Fri: 9:00 AM - 6:00 PM'] },
    { id: 'email', title_ES: 'Correo Electrónico', title_EN: 'Email', lines_ES: ['contacto@caborcaboots.com', 'Respuesta en 24-48 hrs'], lines_EN: ['contacto@caborcaboots.com', 'Response in 24-48 hrs'] },
    { id: 'ubicacion', title_ES: 'Ubicación', title_EN: 'Location', lines_ES: ['León, Guanajuato, México', 'Capital del calzado mexicano'], lines_EN: ['León, Guanajuato, Mexico', 'The Mexican footwear capital'] },
    { id: 'social', title_ES: 'Síguenos', title_EN: 'Follow Us', lines_ES: ['instagram.com/caborca', 'facebook.com/caborca', 'tiktok.com/@caborca'], lines_EN: ['instagram.com/caborca', 'facebook.com/caborca', 'tiktok.com/@caborca'] }
  ])

  const [activeCard, setActiveCard] = useState(null)
  const [cardForm, setCardForm] = useState({ id: '', title_ES: '', title_EN: '', lines_ES: [], lines_EN: [] })
  const [guardando, setGuardando] = useState(false)

  // Load from LocalStorage
    useEffect(() => {
      const fetchContacto = async () => {
        try {
          const data = await textosService.getTextos('contacto');
          if (data && Object.keys(data).length > 0) {
            const mergeHelper = (dft, cur) => cur ? { ...dft, ...cur } : dft;
            
            if (data.info) setInfo(prev => mergeHelper(prev, data.info));
            if (data.formPreview) setFormPreview(prev => mergeHelper(prev, data.formPreview));
            if (data.hero) setHero(prev => mergeHelper(prev, data.hero));
            if (data.cards) setCards(data.cards);
            if (data.seccionAyuda) setSeccionAyuda(prev => mergeHelper(prev, data.seccionAyuda));
            if (data.seccionMapa) setSeccionMapa(prev => mergeHelper(prev, data.seccionMapa));
          }
        } catch (e) {
          console.error('Error loading content', e);
        }
      };
      fetchContacto();
    }, []);

  // Guarda snapshot completo para mantener sincronía entre bloques editables.
  const saveToStorage = async (newData) => {
    const dataToSave = {
      info: newData.info || info,
      formPreview: newData.formPreview || formPreview,
      hero: newData.hero || hero,
      cards: newData.cards || cards,
      seccionAyuda: newData.seccionAyuda || seccionAyuda,
      seccionMapa: newData.seccionMapa || seccionMapa
    };
    try {
      await textosService.updateTextos('contacto', dataToSave);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // Guardado global desde botones superiores del editor.
  const guardarCambios = async () => {
    setGuardando(true)
    try {
      await saveToStorage({}); // Save current state
      success('Cambios guardados correctamente')
    } catch (e) {
      toastError('Error al guardar')
    } finally {
      setGuardando(false)
      setEditarForm(false)
      setEditarInfo(false)
      setEditarHero(false)
      setActiveCard(null)
    }
  }

  // Wrappers para aplicar cambios por sección y persistirlos de inmediato.
  const aplicarHero = async () => {
    await saveToStorage({ hero });
    success('Cambios guardados correctamente')
    setEditarHero(false)
  }

  const handleHeroImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setHero(prev => ({ ...prev, imagen: url }));
    } catch (err) {
      toastError('Error al subir la imagen');
    }
  };

  const aplicarInfo = async () => {
    await saveToStorage({ info });
    success('Cambios guardados correctamente')
    setEditarInfo(false)
  }

  const aplicarFormPreview = async () => {
    await saveToStorage({ formPreview });
    success('Cambios guardados correctamente')
    setEditarForm(false)
  }

  const aplicarCard = async () => {
    const newCards = cards.map(c => c.id === cardForm.id ? { ...c, title_ES: cardForm.title_ES, title_EN: cardForm.title_EN, lines_ES: cardForm.lines_ES, lines_EN: cardForm.lines_EN } : c);
    setCards(newCards);
    await saveToStorage({ cards: newCards });
    success('Cambios guardados correctamente');
    setActiveCard(null);
  }

  const aplicarAyuda = async () => {
    await saveToStorage({ seccionAyuda });
    success('Cambios guardados correctamente');
    setEditarAyuda(false);
  }

  const aplicarMapa = async () => {
    await saveToStorage({ seccionMapa });
    success('Cambios guardados correctamente');
    setEditarMapa(false);
  }

  return (
    <>
      <BotonesPublicar onGuardar={async () => {
        await saveToStorage({});
      }} />
      {/* HERO EDITABLE */}
      <section className="relative bg-gray-50">
        <div className="w-full">
          <div className="w-full">
            <div className="relative overflow-hidden shadow-sm">
              <img
                src={hero.imagen}
                alt="Hero contacto"
                className="w-full h-100 md:h-150 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <div className="inline-block bg-caborca-cafe px-6 py-2 rounded-lg mb-6">
                    <span className="text-sm md:text-base font-bold tracking-widest uppercase text-white block">
                      {idioma === 'es' ? hero.badge_ES : hero.badge_EN}
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-serif mb-6">
                    {idioma === 'es' ? hero.titulo_ES : hero.titulo_EN}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                    {idioma === 'es' ? hero.subtitulo_ES : hero.subtitulo_EN}
                  </p>
                </div>
              </div>
              <EditButton section="hero" onOpen={() => setEditarHero(true)} className="absolute top-4 right-4 z-20" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 mt-8">

        <main className="space-y-12 mt-6">
          {/* Información de contacto */}
          <section data-cms-section="contacto-info" className="bg-white rounded-lg shadow p-6 relative">
            <EditButton section="ayuda" onOpen={() => setEditarAyuda(true)} className="absolute top-4 right-4 z-10" size="sm" />
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-serif text-caborca-cafe mb-3">
                {idioma === 'es' ? seccionAyuda.titulo_ES : seccionAyuda.titulo_EN}
              </h2>
              <p className="text-caborca-cafe text-sm leading-relaxed max-w-2xl mx-auto">
                {idioma === 'es' ? seccionAyuda.subtitulo_ES : seccionAyuda.subtitulo_EN}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map(card => (
                <div key={card.id} className="bg-white p-5 rounded-lg shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow relative">
                  <EditButton section={`card:${card.id}`} onOpen={() => { setActiveCard(card.id); setCardForm({ ...card, lines_ES: card.lines_ES || [...(card.lines || [])], lines_EN: card.lines_EN || [...(card.lines || [])] }); }} className="absolute top-3 right-3 z-10" size="sm" />
                  <div className="w-12 h-12 bg-caborca-cafe rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      {iconoPorCard(card.id)}
                    </svg>
                  </div>
                  <div className="w-full">
                    <h3 className="font-bold text-caborca-cafe text-sm mb-2">{idioma === 'es' ? card.title_ES : card.title_EN}</h3>
                    {card.id === 'social' && socials
                      ? <div className="flex flex-wrap gap-3 mt-2">
                          {Object.entries(socials)
                           .filter(([key, data]) => data && data.show && key !== 'whatsapp' && key !== 'email')
                           .map(([key, data]) => {
                              const fallbackUrl = '#';
                              const rawUrl = data.url || fallbackUrl;
                              const iconSVG = socialIconsSVG[key];
                              if (!iconSVG) return null;
                              return (
                                <a key={key} href={rawUrl} target="_blank" rel="noopener noreferrer" className="text-caborca-cafe hover:text-caborca-bronce transition-colors p-1 pointer-events-none" title={`Ver ${key}`}>
                                  {iconSVG}
                                </a>
                              );
                           })}
                        </div>
                      : (idioma === 'es' ? card.lines_ES || card.lines || [] : card.lines_EN || card.lines || []).map((ln, i) => (
                           <p key={i} className="text-caborca-cafe text-sm mt-1">
                             {card.id === 'telefono' && i === 0 && generalConfig?.telefono ? generalConfig.telefono :
                              card.id === 'email' && i === 0 && socials?.email?.url ? socials.email.url : ln}
                           </p>
                        ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Formulario de contacto (estilo) */}
          <section data-cms-section="contacto-form" className="py-10 sm:py-17 relative" style={{ backgroundColor: '#ECE7DF' }}>
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-serif text-caborca-cafe mb-3">
                  {idioma === 'es' ? seccionMapa.titulo_ES : seccionMapa.titulo_EN}
                </h2>
                <p className="text-caborca-cafe text-sm leading-relaxed max-w-2xl mx-auto mb-4">
                  {idioma === 'es' ? seccionMapa.subtitulo_ES : seccionMapa.subtitulo_EN}
                </p>
                <EditButton section="mapa" onOpen={() => setEditarMapa(true)} className="inline-flex" size="sm" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-7xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-3xl md:text-4xl font-serif text-caborca-cafe mb-2">
                  {idioma === 'es' ? formPreview.titulo_ES : formPreview.titulo_EN}
                </h3>
                <p className="text-sm text-caborca-cafe">
                  {idioma === 'es' ? formPreview.descripcion_ES : formPreview.descripcion_EN}
                </p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); success('Formulario enviado (demo)') }} className="p-8 space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-caborca-cafe mb-2">{idioma === 'es' ? 'Nombre Completo' : 'Full Name'}</label>
                      <input placeholder={idioma === 'es' ? 'Tu nombre' : 'Your name'} className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-caborca-cafe focus:ring-2 focus:ring-caborca-cafe/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-caborca-cafe mb-2">{idioma === 'es' ? 'Correo Electrónico' : 'Email'}</label>
                    <input placeholder="correo@ejemplo.com" className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-caborca-cafe focus:ring-2 focus:ring-caborca-cafe/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-caborca-cafe mb-2">{idioma === 'es' ? 'Teléfono' : 'Phone'}</label>
                    <input placeholder="+52 (555) 123-4567" className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-caborca-cafe focus:ring-2 focus:ring-caborca-cafe/20 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-caborca-cafe mb-2">{idioma === 'es' ? 'Mensaje' : 'Message'}</label>
                  <textarea placeholder={idioma === 'es' ? 'Cuéntanos cómo podemos ayudarte...' : 'Tell us how we can help you...'} rows={6} className="w-full px-4 py-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-caborca-cafe focus:ring-2 focus:ring-caborca-cafe/20 transition-all resize-none" />
                </div>
                <div className="text-center pt-4">
                  <button type="submit" className="bg-caborca-cafe text-white font-bold tracking-wider text-sm px-12 py-4 rounded-lg shadow-lg hover:bg-caborca-negro transition-colors">
                    {idioma === 'es' ? 'ENVIAR MENSAJE' : 'SEND MESSAGE'}
                  </button>
                </div>
              </form>
            </div>
            <EditButton section="form" onOpen={() => setEditarForm(true)} className="absolute top-4 right-4 z-10" size="sm" />
          </section>
        </main>

        {/* Modales */}
        {/* Modal Info General (Telefono, email hidden fields but present in state) */}
        {editarInfo && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-caborca-cafe flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Sección: Información de Contacto (Interna)
                </h3>
                <button onClick={() => setEditarInfo(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                  <input value={info.titulo} onChange={(e) => setInfo(prev => ({ ...prev, titulo: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input value={info.telefono} onChange={(e) => setInfo(prev => ({ ...prev, telefono: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input value={info.email} onChange={(e) => setInfo(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
                  <textarea value={info.direccion} onChange={(e) => setInfo(prev => ({ ...prev, direccion: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none resize-none" rows={2} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Horario</label>
                  <input value={info.horario} onChange={(e) => setInfo(prev => ({ ...prev, horario: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mapa (embed URL)</label>
                  <input value={info.mapaUrl} onChange={(e) => setInfo(prev => ({ ...prev, mapaUrl: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none text-xs text-gray-600" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditarInfo(false)} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  Cancelar
                </button>
                <button onClick={aplicarInfo} className="px-6 py-2 bg-caborca-cafe text-white rounded-lg hover:bg-caborca-negro transition-colors font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {editarForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-caborca-cafe flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Sección: Formulario de Contacto
                </h3>
                <button onClick={() => setEditarForm(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4 text-xs font-semibold text-yellow-800">
                Editando en: {idioma === 'es' ? '🇲🇽 ESPAÑOL' : '🇺🇸 INGLÉS'}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                  <input value={idioma === 'es' ? formPreview.titulo_ES : formPreview.titulo_EN} onChange={(e) => setFormPreview(prev => ({ ...prev, [idioma === 'es' ? 'titulo_ES' : 'titulo_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                  <textarea value={idioma === 'es' ? formPreview.descripcion_ES : formPreview.descripcion_EN} onChange={(e) => setFormPreview(prev => ({ ...prev, [idioma === 'es' ? 'descripcion_ES' : 'descripcion_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none resize-none" rows={3} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditarForm(false)} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  Cancelar
                </button>
                <button onClick={aplicarFormPreview} className="px-6 py-2 bg-caborca-cafe text-white rounded-lg hover:bg-caborca-negro transition-colors font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: editar tarjeta individual */}
        {activeCard && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-caborca-cafe flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Sección: Tarjeta {cardForm.title}
                </h3>
                <button onClick={() => setActiveCard(null)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4 text-xs font-semibold text-yellow-800">
                Editando en: {idioma === 'es' ? '🇲🇽 ESPAÑOL' : '🇺🇸 INGLÉS'}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                  <input value={idioma === 'es' ? cardForm.title_ES : cardForm.title_EN} onChange={(e) => setCardForm(prev => ({ ...prev, [idioma === 'es' ? 'title_ES' : 'title_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" />
                </div>
                {cardForm.id !== 'email' && cardForm.id !== 'social' && cardForm.id !== 'telefono' ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Líneas (una por renglón)</label>
                    <textarea value={(idioma === 'es' ? cardForm.lines_ES : cardForm.lines_EN).join('\n')} onChange={(e) => setCardForm(prev => ({ ...prev, [idioma === 'es' ? 'lines_ES' : 'lines_EN']: e.target.value.split('\n') }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none resize-none" rows={4} />
                  </div>
                ) : (
                  <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600 border border-gray-200">
                    <p className="font-semibold mb-1">Nota:</p>
                    <p>La información que se mostrará aquí se obtiene automáticamente de la <strong>Configuración General</strong> del sistema para mantener tu sitio siempre consistente.</p>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setActiveCard(null)} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  Cancelar
                </button>
                <button onClick={aplicarCard} className="px-6 py-2 bg-caborca-cafe text-white rounded-lg hover:bg-caborca-negro transition-colors font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {editarHero && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-caborca-cafe flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Sección: Hero
                </h3>
                <button onClick={() => setEditarHero(false)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4 text-xs font-semibold text-yellow-800">
                Editando en: {idioma === 'es' ? '🇲🇽 ESPAÑOL' : '🇺🇸 INGLÉS'}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Badge</label>
                  <input value={idioma === 'es' ? hero.badge_ES : hero.badge_EN} onChange={(e) => setHero(prev => ({ ...prev, [idioma === 'es' ? 'badge_ES' : 'badge_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                  <input value={idioma === 'es' ? hero.titulo_ES : hero.titulo_EN} onChange={(e) => setHero(prev => ({ ...prev, [idioma === 'es' ? 'titulo_ES' : 'titulo_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtítulo</label>
                  <textarea value={idioma === 'es' ? hero.subtitulo_ES : hero.subtitulo_EN} onChange={(e) => setHero(prev => ({ ...prev, [idioma === 'es' ? 'subtitulo_ES' : 'subtitulo_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none resize-none" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen</label>
                  <div className="text-xs font-semibold text-gray-500 mb-2 whitespace-pre-line">PANORÁMICA 1920 x 1080 px (16:9){'\n'}Max 1MB</div>
                  <div className="flex gap-2">
                    <input value={hero.imagen} onChange={(e) => setHero(prev => ({ ...prev, imagen: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" />
                    <label htmlFor="contactoHeroImgInput" className="cursor-pointer bg-caborca-cafe text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-caborca-negro whitespace-nowrap">
                      Cargar
                      <input id="contactoHeroImgInput" type="file" accept="image/*" onChange={handleHeroImage} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditarHero(false)} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  Cancelar
                </button>
                <button onClick={aplicarHero} className="px-6 py-2 bg-caborca-cafe text-white rounded-lg hover:bg-caborca-negro transition-colors font-semibold flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                   Guardar
                 </button>
               </div>
             </div>
           </div>
         )}

        {editarAyuda && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-caborca-cafe">Sección: ¿Cómo podemos ayudarte?</h3>
                <button onClick={() => setEditarAyuda(false)} className="text-gray-500 hover:text-gray-700"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4 text-xs font-semibold text-yellow-800">Editando en: {idioma === 'es' ? '🇲🇽 ESPAÑOL' : '🇺🇸 INGLÉS'}</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                  <input value={idioma === 'es' ? seccionAyuda.titulo_ES : seccionAyuda.titulo_EN} onChange={(e) => setSeccionAyuda(prev => ({ ...prev, [idioma === 'es' ? 'titulo_ES' : 'titulo_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtítulo</label>
                  <textarea value={idioma === 'es' ? seccionAyuda.subtitulo_ES : seccionAyuda.subtitulo_EN} onChange={(e) => setSeccionAyuda(prev => ({ ...prev, [idioma === 'es' ? 'subtitulo_ES' : 'subtitulo_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none resize-none" rows={3} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditarAyuda(false)} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>Cancelar</button>
                <button onClick={aplicarAyuda} className="px-6 py-2 bg-caborca-cafe text-white rounded-lg hover:bg-caborca-negro font-semibold flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {editarMapa && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-caborca-cafe">Sección: Encuéntranos en el mapa</h3>
                <button onClick={() => setEditarMapa(false)} className="text-gray-500 hover:text-gray-700"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2 mb-4 text-xs font-semibold text-yellow-800">Editando en: {idioma === 'es' ? '🇲🇽 ESPAÑOL' : '🇺🇸 INGLÉS'}</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                  <input value={idioma === 'es' ? seccionMapa.titulo_ES : seccionMapa.titulo_EN} onChange={(e) => setSeccionMapa(prev => ({ ...prev, [idioma === 'es' ? 'titulo_ES' : 'titulo_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtítulo</label>
                  <textarea value={idioma === 'es' ? seccionMapa.subtitulo_ES : seccionMapa.subtitulo_EN} onChange={(e) => setSeccionMapa(prev => ({ ...prev, [idioma === 'es' ? 'subtitulo_ES' : 'subtitulo_EN']: e.target.value }))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none resize-none" rows={3} />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setEditarMapa(false)} className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>Cancelar</button>
                <button onClick={aplicarMapa} className="px-6 py-2 bg-caborca-cafe text-white rounded-lg hover:bg-caborca-negro font-semibold flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>Guardar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}
