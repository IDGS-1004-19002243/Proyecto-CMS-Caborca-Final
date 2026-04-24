import { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// ── Fix icono por defecto de Leaflet con bundlers ────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const NOMINATIM = 'https://nominatim.openstreetmap.org';

/** Extrae campos de dirección del objeto address de Nominatim */
function parseNominatimAddress(addr, displayName) {
    if (!addr) return {};
    return {
        pais: addr.country || '',
        estado: addr.state || addr.province || addr.region || addr.county || '',
        ciudad: addr.city || addr.town || addr.village || addr.municipality || addr.suburb || '',
        colonia: addr.suburb || addr.neighbourhood || addr.quarter || addr.district || '',
        calle: [addr.road, addr.street, addr.pedestrian, addr.footway].find(Boolean) || '',
        numeroExt: addr.house_number || '',
        cp: addr.postcode || '',
    };
}

/** Mueve el mapa a una posición */
function FlyTo({ pos }) {
    const map = useMap();
    useEffect(() => {
        if (pos) map.flyTo(pos, 15, { duration: 1 });
    }, [pos, map]);
    return null;
}

/** Captura clics en el mapa */
function ClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) { onMapClick([e.latlng.lat, e.latlng.lng]); },
    });
    return null;
}

/**
 * MapPickerPanel
 * Props:
 *   lat, lng        — valores actuales
 *   onSelect(data)  — callback con { lat, lng, pais, estado, ciudad, colonia, calle, numeroExt, cp }
 */
export default function MapPickerPanel({ lat, lng, onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [markerPos, setMarkerPos] = useState(
        lat && lng ? [parseFloat(lat), parseFloat(lng)] : null
    );
    const [flyTo, setFlyTo] = useState(markerPos);
    const [info, setInfo] = useState('');
    const debounceRef = useRef(null);

    // Si lat/lng cambian desde afuera, actualiza el marcador
    useEffect(() => {
        if (lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
            const p = [parseFloat(lat), parseFloat(lng)];
            setMarkerPos(p);
            setFlyTo(p);
        }
    }, [lat, lng]);

    // Búsqueda con debounce
    useEffect(() => {
        clearTimeout(debounceRef.current);
        if (query.trim().length < 3) { setResults([]); return; }
        debounceRef.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await fetch(
                    `${NOMINATIM}/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`,
                    { headers: { 'Accept-Language': 'es' } }
                );
                const data = await res.json();
                setResults(data);
            } catch { setResults([]); }
            setSearching(false);
        }, 500);
        return () => clearTimeout(debounceRef.current);
    }, [query]);

    /** Reverse geocoding cuando el usuario hace clic en el mapa */
    const handleMapClick = useCallback(async (pos) => {
        setMarkerPos(pos);
        setInfo('Obteniendo dirección...');
        try {
            const res = await fetch(
                `${NOMINATIM}/reverse?lat=${pos[0]}&lon=${pos[1]}&format=json&addressdetails=1`,
                { headers: { 'Accept-Language': 'es' } }
            );
            const data = await res.json();
            const addr = parseNominatimAddress(data.address, data.display_name);
            setInfo(data.display_name || 'Ubicación seleccionada');
            onSelect({ lat: pos[0].toFixed(6), lng: pos[1].toFixed(6), ...addr });
        } catch {
            setInfo('No se pudo obtener la dirección');
            onSelect({ lat: pos[0].toFixed(6), lng: pos[1].toFixed(6) });
        }
        setResults([]);
        setQuery('');
    }, [onSelect]);

    /** Seleccionar resultado de búsqueda */
    const handleResultClick = useCallback((r) => {
        const pos = [parseFloat(r.lat), parseFloat(r.lon)];
        setMarkerPos(pos);
        setFlyTo(pos);
        setResults([]);
        setQuery(r.display_name);
        const addr = parseNominatimAddress(r.address, r.display_name);
        setInfo(r.display_name);
        onSelect({ lat: r.lat, lng: r.lon, ...addr });
    }, [onSelect]);

    const center = markerPos || [23.6345, -102.5528]; // Centro de México por defecto

    return (
        <div className="space-y-3">
            {/* Buscador */}
            <div className="relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Buscar lugar, ciudad, dirección..."
                            className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:border-caborca-cafe focus:outline-none"
                        />
                        {searching && (
                            <div className="absolute inset-y-0 right-3 flex items-center">
                                <svg className="w-4 h-4 animate-spin text-caborca-cafe" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    {markerPos && (
                        <button
                            type="button"
                            onClick={() => onSelect({ lat: markerPos[0].toFixed(6), lng: markerPos[1].toFixed(6) })}
                            className="px-3 py-2 bg-caborca-cafe text-white rounded-lg text-xs font-bold hover:bg-caborca-negro transition-colors whitespace-nowrap"
                        >
                            ✓ Usar punto
                        </button>
                    )}
                </div>

                {/* Dropdown de resultados */}
                {results.length > 0 && (
                    <ul className="absolute z-[1000] left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden max-h-60 overflow-y-auto">
                        {results.map((r, i) => (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => handleResultClick(r)}
                                    className="w-full text-left px-4 py-3 text-sm hover:bg-caborca-beige-suave transition-colors border-b border-gray-50 last:border-0 flex items-start gap-2"
                                >
                                    <svg className="w-4 h-4 text-caborca-cafe flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="leading-snug text-gray-700">{r.display_name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Info del punto seleccionado */}
            {info && (
                <p className="text-xs text-caborca-cafe/80 bg-caborca-beige-suave px-3 py-2 rounded-lg flex items-start gap-1.5">
                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-caborca-cafe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="font-medium">{info}</span>
                </p>
            )}

            {/* Instrucción */}
            <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Busca por nombre o haz <strong>clic en el mapa</strong> para fijar la ubicación. Los datos de dirección se llenan automáticamente.
            </p>

            {/* Mapa */}
            <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-md" style={{ height: 340 }}>
                <MapContainer
                    center={center}
                    zoom={markerPos ? 14 : 5}
                    style={{ height: '100%', width: '100%' }}
                    key={`map-picker`}
                    attributionControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <ClickHandler onMapClick={handleMapClick} />
                    {flyTo && <FlyTo pos={flyTo} />}
                    {markerPos && (
                        <Marker
                            position={markerPos}
                            draggable={true}
                            eventHandlers={{
                                dragend(e) {
                                    const { lat, lng } = e.target.getLatLng();
                                    handleMapClick([lat, lng]);
                                },
                            }}
                        />
                    )}
                </MapContainer>
            </div>

            {/* Coordenadas actuales */}
            {markerPos && (
                <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>
                        <strong>Lat:</strong> {markerPos[0].toFixed(6)} &nbsp;
                        <strong>Lng:</strong> {markerPos[1].toFixed(6)}
                    </span>
                    <span className="text-green-600 font-semibold ml-auto">✓ Punto fijado</span>
                </div>
            )}
        </div>
    );
}
