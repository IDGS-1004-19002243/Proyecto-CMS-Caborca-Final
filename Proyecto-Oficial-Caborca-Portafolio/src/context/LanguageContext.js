import { createContext, useContext } from 'react';

/** Contexto global de idioma con función traductora y setter. */
export const LanguageContext = createContext();

/**
 * Hook tipado de acceso al contexto de idioma.
 * @throws {Error} Si se usa fuera de LanguageProvider.
 */
export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
