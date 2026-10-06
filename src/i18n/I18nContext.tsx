import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS, TranslationDictionary } from './translations';

export interface LanguageMeta {
  code: Language;
  label: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: LanguageMeta[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
];

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  // Detect browser language on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('project3d_lang') as Language;
      if (stored && TRANSLATIONS[stored]) {
        setLanguageState(stored);
        return;
      }

      const browserLang = (navigator.language || '').toLowerCase();
      if (browserLang.startsWith('en')) {
        setLanguageState('en');
      } else if (browserLang.startsWith('fr')) {
        setLanguageState('fr');
      } else if (browserLang.startsWith('it')) {
        setLanguageState('it');
      } else if (browserLang.startsWith('pt')) {
        setLanguageState('pt');
      } else {
        setLanguageState('es');
      }
    } catch (e) {
      setLanguageState('es');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('project3d_lang', lang);
      document.documentElement.lang = lang;
    } catch (e) {
      // ignore
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.es;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
