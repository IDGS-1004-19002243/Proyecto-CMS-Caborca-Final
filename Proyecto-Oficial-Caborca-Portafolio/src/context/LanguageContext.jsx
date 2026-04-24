import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('caborca_pref_lang');
        return saved || 'es';
    });

    useEffect(() => {
        localStorage.setItem('caborca_pref_lang', language);
    }, [language]);

    const findKeyInsensitive = (source, desiredKey) => {
        if (!source || typeof source !== 'object' || !desiredKey) return undefined;
        const desired = String(desiredKey).toLowerCase();
        return Object.keys(source).find((key) => key.toLowerCase() === desired);
    };

    const isEmpty = (value) => value === undefined || value === null || value === '';

    const t = (obj, field) => {
        if (!obj || typeof obj !== 'object' || !field) return '';

        const directKey = findKeyInsensitive(obj, field);
        const directValue = directKey ? obj[directKey] : undefined;

        // Si el objeto tiene directamente las llaves es/en
        if (directValue && typeof directValue === 'object' && !Array.isArray(directValue)) {
            const langKey = findKeyInsensitive(directValue, language);
            const esKey = findKeyInsensitive(directValue, 'es');
            const langValue = langKey ? directValue[langKey] : undefined;
            const esValue = esKey ? directValue[esKey] : undefined;
            return !isEmpty(langValue) ? langValue : (esValue ?? '');
        }

        // Si el objeto tiene campos con sufijos _ES / _EN (Formato de la API)
        const suffix = language.toUpperCase();
        const preferredKey = findKeyInsensitive(obj, `${field}_${suffix}`);
        const fallbackEsKey = findKeyInsensitive(obj, `${field}_ES`);
        const preferredValue = preferredKey ? obj[preferredKey] : undefined;
        const fallbackEsValue = fallbackEsKey ? obj[fallbackEsKey] : undefined;

        if (!isEmpty(preferredValue)) return preferredValue;
        if (fallbackEsValue !== undefined && fallbackEsValue !== null) return fallbackEsValue;

        // Fallback al campo original si no hay sufijos
        return directValue ?? '';
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
