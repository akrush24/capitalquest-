import { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

import es from '../locales/es.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import zh from '../locales/zh.json';

const translations: { [key: string]: any } = { en, ru, es, fr, de, zh };
const supportedLangs = ['en', 'ru', 'es', 'fr', 'de', 'zh'];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const initialLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
    setLanguage(initialLang);
  }, []);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    let translation = translations[language][key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
      });
    }
    return translation;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
