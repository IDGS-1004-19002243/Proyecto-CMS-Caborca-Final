import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { textosService } from '../api/textosService';
import { uploadImage } from '../api/uploadService';
import BotonesPublicar from '../componentes/BotonesPublicar';

import { useOutletContext } from 'react-router-dom';

/**
 * Editor CMS de la página de mantenimiento.
 * Administra textos, fondo y visibilidad de redes sociales por idioma.
 */
export default function EditarMantenimiento() {
    const { success, error: toastError } = useToast();
    const { lang: idioma } = useOutletContext();
    const [content, setContent] = useState({
        titulo_ES: 'Página en Construcción',
        titulo_EN: 'Page Under Construction',
        subtitulo_ES: 'ESTAMOS PREPARANDO ALGO INCREÍBLE',
        subtitulo_EN: 'WE ARE PREPARING SOMETHING AMAZING',
        mensaje_ES: 'Estamos trabajando arduamente para traerte una experiencia renovada.',
        mensaje_EN: 'We are working hard to bring you a renewed experience.',
        imagenFondo: 'https://blocks.astratic.com/img/general-img-landscape.png',
        redes: {
            whatsapp: { url: 'https://wa.me/525551234567', enabled: true },
            facebook: { url: 'https://facebook.com', enabled: true },
            instagram: { url: 'https://instagram.com', enabled: true },
            tiktok: { url: 'https://tiktok.com', enabled: true },
            email: { url: 'mailto:contacto@caborca.com', enabled: true }
        }
    });
    const [guardando, setGuardando] = useState(false);

    useEffect(() => {
        // Carga datos persistidos y migra estructuras antiguas de redes.
        const fetchMantenimiento = async () => {
            try {
                const data = await textosService.getTextos('mantenimiento');
                if (data && Object.keys(data).length > 0) {
                    const parsed = data;
                    const migratedRedes = {};
                    if (parsed.redes) {
                        Object.keys(parsed.redes).forEach(key => {
                            const val = parsed.redes[key];
                            if (typeof val === 'string') {
                                migratedRedes[key] = { url: val, enabled: !!val };
                            } else {
                                migratedRedes[key] = val;
                            }
                        });
                        setContent(prev => {
                            parsed.redes = { ...prev.redes, ...migratedRedes };
                            return { ...prev, ...parsed };
                        });
                    } else {
                        setContent(prev => ({ ...prev, ...parsed }));
                    }
                }
            } catch (e) {
                console.error("Error al cargar configuración de mantenimiento de la base de datos.");
            }
        };
        fetchMantenimiento();
    }, []);

    // Actualiza una propiedad raíz del contenido editable.
    const handleChange = (field, value) => {
        setContent(prev => ({ ...prev, [field]: value }));
    };

    // Actualiza URL o estado enabled de una red específica.
    const handleRedesChange = (network, field, value) => {
        setContent(prev => ({
            ...prev,
            redes: {
                ...prev.redes,
                [network]: {
                    ...prev.redes[network],
                    [field]: value
                }
            }
        }));
    };

    // Persiste configuración completa de mantenimiento en backend.
    const guardarCambios = async () => {
        setGuardando(true);
        try {
            await textosService.updateTextos('mantenimiento', content);
            success('Configuración guardada correctamente');
        } catch (e) {
            toastError('Error al guardar en el servidor');
        } finally {
            setGuardando(false);
        }
    };

    // Renderiza el icono SVG correcto para cada red social
    const renderSocialIcon = (key, className = "w-4 h-4") => {
        switch (key) {
            case 'whatsapp':
                return (
                    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.506.709.31 1.262.496 1.694.633.712.226 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                );
            case 'facebook':
                return (
                    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                );
            case 'instagram':
                return (
                    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 3.6c-2.3 0-2.58.01-3.48.05C5.34 3.8 3.8 5.34 3.65 8.52 3.61 9.42 3.6 9.7 3.6 12c0 2.3.01 2.58.05 3.48.15 3.18 1.69 4.72 4.87 4.87.9.04 1.18.05 3.48.05 2.3 0 2.58-.01 3.48-.05 3.17-.15 4.72-1.69 4.87-4.87.04-.9.05-1.18.05-3.48 0-2.3-.01-2.58-.05-3.48-.15-3.17-1.69-4.72-4.87-4.87C14.58 3.61 14.3 3.6 12 3.6zm0 1.44c2.26 0 2.53.01 3.42.05 2.46.11 3.38 1.05 3.49 3.49.04.89.05 1.16.05 3.42 0 2.26-.01 2.53-.05 3.42-.11 2.44-1.03 3.38-3.49 3.49-.89.04-1.16.05-3.42.05-2.26 0-2.53-.01-3.42-.05-2.46-.11-3.38-1.05-3.49-3.49C5.05 14.53 5.04 14.26 5.04 12c0-2.26.01-2.53.05-3.42.11-2.44 1.03-3.38 3.49-3.49.89-.04 1.16-.05 3.42-.05zM12 7.38A4.62 4.62 0 1012 16.62 4.62 4.62 0 0012 7.38zm0 1.44A3.18 3.18 0 1112 15.18 3.18 3.18 0 0112 8.82zm4.8-2.56a1.08 1.08 0 100 2.16 1.08 1.08 0 000-2.16z" />
                    </svg>
                );
            case 'tiktok':
                return (
                    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.04-.1z" />
                    </svg>
                );
            case 'email':
                return (
                    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6">
            {/* Panel de Edición (Izquierda o Arriba en móviles) */}
            <div className="w-full lg:w-2/5 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center bg-stripes-caborca">
                    <h3 className="font-bold text-caborca-cafe">Sección: Mantenimiento</h3>
                    <BotonesPublicar onGuardar={guardarCambios} />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300">

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase border-b pb-1 tracking-wider">Contenido Principal</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={idioma === 'es' ? content.titulo_ES : content.titulo_EN}
                                    onChange={(e) => handleChange(idioma === 'es' ? 'titulo_ES' : 'titulo_EN', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Subtítulo (Uppercase)</label>
                                <input
                                    type="text"
                                    value={idioma === 'es' ? content.subtitulo_ES : content.subtitulo_EN}
                                    onChange={(e) => handleChange(idioma === 'es' ? 'subtitulo_ES' : 'subtitulo_EN', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none uppercase"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mensaje</label>
                                <textarea
                                    rows={3}
                                    value={idioma === 'es' ? content.mensaje_ES : content.mensaje_EN}
                                    onChange={(e) => handleChange(idioma === 'es' ? 'mensaje_ES' : 'mensaje_EN', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-500 uppercase border-b pb-1 tracking-wider">Imagen de Fondo</h4>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Preview & Carga</label>
                            <div className="text-xs font-semibold text-gray-500 mb-2 whitespace-pre-line">PANORÁMICA 1920 x 1080 px (16:9){'\n'}Max 1MB</div>
                            <div className="flex gap-4 items-start">
                                <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden shrink-0 border border-gray-300">
                                    {content.imagenFondo ? (
                                        <img src={content.imagenFondo} alt="Fondo" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">Sin imagen</div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={content.imagenFondo}
                                            onChange={(e) => handleChange('imagenFondo', e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                                            placeholder="URL de la imagen"
                                        />
                                        <label className="cursor-pointer inline-flex items-center gap-1 bg-caborca-beige-suave text-caborca-cafe px-2 py-1 rounded text-xs font-bold hover:bg-caborca-cafe hover:text-white transition-colors whitespace-nowrap">
                                            <span>📂 Cargar</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        try {
                                                            const url = await uploadImage(file);
                                                            handleChange('imagenFondo', url);
                                                        } catch (err) {
                                                            toastError('Error al subir la imagen');
                                                        }
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase border-b pb-1 tracking-wider">Redes Sociales</h4>
                        <div className="divide-y divide-gray-100">
                            {['whatsapp', 'facebook', 'instagram', 'tiktok', 'email'].map((key) => (
                                <div key={key} className="py-3 flex items-start gap-3">
                                    <div className={`mt-2 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${content.redes?.[key]?.enabled ? 'bg-caborca-cafe text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        {renderSocialIcon(key, 'w-4 h-4')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-bold uppercase text-gray-600">{key}</span>
                                            <input
                                                type="checkbox"
                                                checked={content.redes?.[key]?.enabled ?? true}
                                                onChange={(e) => handleRedesChange(key, 'enabled', e.target.checked)}
                                                className="rounded text-caborca-cafe focus:ring-caborca-cafe h-4 w-4 border-gray-300 cursor-pointer"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={content.redes?.[key]?.url || ''}
                                            onChange={(e) => handleRedesChange(key, 'url', e.target.value)}
                                            disabled={!(content.redes?.[key]?.enabled ?? true)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-caborca-cafe focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 transition-colors text-sm"
                                            placeholder={`https://${key}...`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Vista Previa (Derecha) - CLON EXACTO DE ENCONSTRUCCION.JSX */}
            <div className="w-full lg:w-3/5 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative group">

                <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white font-sans overflow-hidden p-6 text-center">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        {content.imagenFondo && (
                            <img
                                src={content.imagenFondo}
                                alt="Fondo"
                                className="w-full h-full object-cover opacity-50 transition-all duration-500"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-2xl mx-auto transform scale-75 lg:scale-90 origin-center transition-transform duration-300">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
                            {idioma === 'es' ? content.titulo_ES : content.titulo_EN}
                        </h1>

                        <p className="text-caborca-bronce font-bold text-lg md:text-xl mb-8 uppercase tracking-[0.2em] shadow-black drop-shadow-md">
                            {idioma === 'es' ? content.subtitulo_ES : content.subtitulo_EN}
                        </p>

                        <div className="w-24 h-1.5 bg-caborca-bronce mx-auto mb-8 rounded-full shadow-lg opacity-80"></div>

                        <p className="text-lg text-gray-200 max-w-lg mx-auto mb-10 leading-relaxed font-light drop-shadow-md whitespace-pre-wrap">
                            {idioma === 'es' ? content.mensaje_ES : content.mensaje_EN}
                        </p>

                        <div className="flex justify-center gap-6">
                            {['whatsapp', 'facebook', 'instagram', 'tiktok', 'email'].map(key => {
                                const config = content.redes?.[key];
                                if (!config?.enabled || !config?.url) return null;
                                return (
                                    <div key={key} className="text-white opacity-80 cursor-default">
                                        {renderSocialIcon(key, 'w-6 h-6 drop-shadow-md')}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
