import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { textosService } from '../api/textosService';
import { settingsService } from '../api/settingsService';
import { useToast } from '../context/ToastContext';

/**
 * BotonesPublicar - Botones flotantes reutilizables para todos los editores del CMS.
 * Props:
 *   onGuardar: función async que guarda el borrador
 *   label?: texto del botón guardar (default: "Guardar Borrador")
 */
const BotonesPublicar = ({ onGuardar, label = 'Guardar Borrador' }) => {
    const { success, error: toastError } = useToast();
    const [guardando, setGuardando] = useState(false);
    const [publicando, setPublicando] = useState(false);
    const [deployModalOpen, setDeployModalOpen] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduledInfo, setScheduledInfo] = useState(null); // fecha ya programada
    const [domNode, setDomNode] = useState(null);

    useEffect(() => {
        setDomNode(document.getElementById('top-bar-actions'));
    }, []);

    const handleGuardar = async () => {
        setGuardando(true);
        try {
            await onGuardar();
            success('Borrador guardado correctamente.');
        } catch (err) {
            console.error(err);
            toastError('Error al guardar el borrador.');
        } finally {
            setGuardando(false);
        }
    };

    const handleDeployNow = async () => {
        setPublicando(true);
        try {
            await onGuardar();
            await textosService.deployContent();
            success('¡Cambios PUBLICADOS! El portafolio ya muestra los nuevos contenidos. 🎉');
            setDeployModalOpen(false);
        } catch (err) {
            console.error(err);
            toastError('Error al publicar los cambios.');
        } finally {
            setPublicando(false);
        }
    };

    const handleScheduleDeploy = async () => {
        if (!scheduleDate) return;
        try {
            await settingsService.setDeploySchedule(new Date(scheduleDate).toISOString());
            success(`Despliegue programado para: ${new Date(scheduleDate).toLocaleString()}`);
            setScheduledInfo(new Date(scheduleDate).toISOString());
            setDeployModalOpen(false);
            setScheduleDate('');
        } catch (err) {
            toastError('Error al programar el despliegue.');
        }
    };

    const handleCancelSchedule = async () => {
        try {
            await settingsService.setDeploySchedule('');
            setScheduledInfo(null);
            success('Despliegue programado cancelado.');
        } catch (err) {
            toastError('Error al cancelar el despliegue programado.');
        }
    };

    const openModal = async () => {
        setDeployModalOpen(true);
        try {
            const data = await settingsService.getDeploySchedule();
            setScheduledInfo(data && data.date ? data.date : null);
        } catch (e) {
            setScheduledInfo(null);
        }
    };

    const disabled = guardando || publicando;

    // Ícono de rayo para el botón deploy
    const iconoRayo = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );

    const content = (
        <div className="flex items-center gap-3 mr-2">
            {/* Botón Guardar Borrador */}
            <button
                onClick={handleGuardar}
                disabled={disabled}
                className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-md font-bold text-sm transition-all transform hover:scale-105 active:scale-95 ${disabled ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#9C8A79] hover:bg-[#8A7968] text-white'}`}
            >
                {guardando ? (
                    <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Guardando...</span>
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        <span>{label}</span>
                    </>
                )}
            </button>

            {/* Botón Desplegar → abre modal */}
            <button
                onClick={openModal}
                disabled={disabled}
                className={`flex items-center gap-2 px-5 py-2 rounded-full shadow-md font-bold text-sm transition-all transform hover:scale-105 active:scale-95 ${disabled ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-[#008035] hover:bg-[#00662a] text-white'}`}
            >
                {iconoRayo}
                <span>Desplegar</span>
            </button>

            {/* Modal de Despliegue */}
            {deployModalOpen && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-zoom-in">
                        {/* Header */}
                        <div className="bg-caborca-cafe p-6 text-white text-center relative">
                            <button
                                onClick={() => setDeployModalOpen(false)}
                                className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-serif font-bold font-bold">Desplegar Cambios</h3>
                            <p className="text-white/80 mt-2 text-sm">Publica tus ediciones en el sitio oficial</p>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-6">
                            {/* Advertencia */}
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                <div className="flex">
                                    <span className="mr-3 text-yellow-500">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <p className="font-bold text-yellow-800">Advertencia</p>
                                        <p className="text-sm text-yellow-700 mt-1">Esta acción sobrescribirá la versión pública actual con tus borradores guardados.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Banner: despliegue ya programado */}
                            {scheduledInfo && (
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-sm font-bold text-blue-800">Despliegue ya programado</p>
                                            <p className="text-xs text-blue-600">{new Date(scheduledInfo).toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCancelSchedule}
                                        className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4 pt-2">
                                {/* Desplegar Ahora */}
                                <button
                                    onClick={handleDeployNow}
                                    disabled={publicando}
                                    className="w-full group bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white p-4 rounded-xl flex items-center justify-between transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]"
                                >
                                    <div className="text-left">
                                        <span className="block font-bold text-lg">
                                            {publicando ? 'Publicando...' : 'Desplegar Ahora'}
                                        </span>
                                        <span className="text-sm text-green-100">Publicar cambios inmediatamente</span>
                                    </div>
                                    <span className="group-hover:translate-x-1 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </button>

                                {/* Programar */}
                                <div className="relative pt-4 border-t border-gray-100">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Programar Fecha y Hora</label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="datetime-local"
                                                className="w-full pl-10 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 text-sm focus:ring-caborca-cafe focus:border-caborca-cafe block"
                                                value={scheduleDate}
                                                onChange={(e) => setScheduleDate(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={handleScheduleDeploy}
                                            disabled={!scheduleDate}
                                            className="bg-caborca-cafe hover:bg-caborca-negro text-white px-4 rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Programar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-4 flex justify-center border-t border-gray-100">
                            <button
                                onClick={() => setDeployModalOpen(false)}
                                className="text-red-500 hover:text-red-700 font-semibold text-sm px-6 py-2 hover:bg-red-50 rounded transition-colors"
                            >
                                Cancelar Operación
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );

    if (domNode) {
        return createPortal(content, domNode);
    }

    return content;
};

export default BotonesPublicar;
