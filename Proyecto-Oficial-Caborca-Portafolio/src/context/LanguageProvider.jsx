import React, { useState, useEffect } from 'react';
import { LanguageContext } from './LanguageContext';

const VALID_LANGUAGES = new Set(['es', 'en']);
const SPANISH_REGION_CODES = new Set([
    'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GQ', 'GT', 'HN',
    'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'ES', 'UY', 'VE'
]);
const ENGLISH_REGION_CODES = new Set(['US', 'GB', 'CA', 'AU', 'NZ', 'IE']);

/**
 * Detecta idioma inicial usando locale del navegador y zona horaria.
 * Retorna 'es' por defecto para evitar UI sin idioma.
 */
const detectLanguageByRegion = () => {
    if (typeof navigator === 'undefined') return 'es';

    const locales = [navigator.language, ...(navigator.languages || [])].filter(Boolean);

    for (const locale of locales) {
        const normalized = locale.replace('_', '-');
        const [langPart, regionPart] = normalized.split('-');
        const lang = (langPart || '').toLowerCase();
        const region = (regionPart || '').toUpperCase();

        if (lang === 'es') return 'es';
        if (lang === 'en') return 'en';

        if (region && SPANISH_REGION_CODES.has(region)) return 'es';
        if (region && ENGLISH_REGION_CODES.has(region)) return 'en';
    }

    const timeZone = Intl.DateTimeFormat?.().resolvedOptions?.().timeZone || '';
    if (/Mexico|Madrid|Bogota|Lima|Santiago|Buenos_Aires|Caracas|Guatemala|Panama|Montevideo|Asuncion/i.test(timeZone)) {
        return 'es';
    }

    if (/New_York|Chicago|Los_Angeles|Toronto|Vancouver|London|Dublin|Sydney|Melbourne|Auckland/i.test(timeZone)) {
        return 'en';
    }

    return 'es';
};

/**
 * Proveedor global de idioma para el sitio público.
 * Expone language, setLanguage y helper t(obj, field).
 */
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        try {
            const saved = localStorage.getItem('caborca_pref_lang');
            if (saved && VALID_LANGUAGES.has(saved)) return saved;
        } catch {
            // Ignora bloqueos de storage y usa deteccion de region.
        }

        return detectLanguageByRegion();
    });

    useEffect(() => {
        localStorage.setItem('caborca_pref_lang', language);
    }, [language]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = language;
        }
    }, [language]);

    const hasValue = (value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim() !== '';
        return true;
    };

    const getKeyInsensitive = (obj, key) => {
        const entry = Object.entries(obj).find(([k]) => k.toLowerCase() === key.toLowerCase());
        return entry ? entry[1] : undefined;
    };

        // Traductor flexible para objetos anidados (es/en) y campos con sufijo _ES/_EN.
    const t = (obj, field) => {
        if (!obj) return '';

        // Si el objeto tiene directamente las llaves es/en
        const nestedValue = getKeyInsensitive(obj, field);
        if (nestedValue && typeof nestedValue === 'object') {
            return nestedValue[language] || nestedValue.es || '';
        }

        // Si el objeto tiene campos con sufijos _ES / _EN (Formato de la API)
        const currentSuffix = language.toUpperCase();
        const fallbackSuffix = language === 'es' ? 'EN' : 'ES';

        const currentValue = getKeyInsensitive(obj, `${field}_${currentSuffix}`);
        if (hasValue(currentValue)) return currentValue;

        const fallbackValue = getKeyInsensitive(obj, `${field}_${fallbackSuffix}`);
        if (hasValue(fallbackValue)) return fallbackValue;

        // Fallback al campo original si no hay sufijos (compatibilidad con datos planos)
        const plainValue = getKeyInsensitive(obj, field);
        return hasValue(plainValue) ? plainValue : '';
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

