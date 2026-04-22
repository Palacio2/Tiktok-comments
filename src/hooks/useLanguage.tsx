import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { translations, TranslationSchema } from '@/utils/translations';

export interface LanguageObj {
  code: string;
  label: string;
  countryCode: string;
}

interface LanguageContextType {
  language: string;
  t: TranslationSchema;
  isLangMenuOpen: boolean;
  currentLangObj: LanguageObj;
  LANGUAGES: LanguageObj[];
  toggleLangMenu: () => void;
  selectLanguage: (code: string) => void;
  setLanguage: (code: string) => void;
}

// Винесли масив за межі компонента, щоб він не перестворювався при кожному рендері
const LANGUAGES: LanguageObj[] = [
  { code: 'uk', label: 'Українська', countryCode: 'ua' },
  { code: 'en', label: 'English', countryCode: 'us' },
  { code: 'pl', label: 'Polski', countryCode: 'pl' },
  { code: 'fr', label: 'Français', countryCode: 'fr' },
  { code: 'ru', label: 'Русский', countryCode: 'ru' },
];

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('uk');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  
  // Правильна типізація замість @ts-ignore
  const t = translations[language as keyof typeof translations] || translations['uk'];

  const toggleLangMenu = useCallback(() => setIsLangMenuOpen(prev => !prev), []);
  
  const selectLanguage = useCallback((code: string) => {
    setLanguage(code);
    setIsLangMenuOpen(false);
  }, []);

  const value = {
    language,
    t,
    isLangMenuOpen,
    currentLangObj,
    LANGUAGES,
    toggleLangMenu,
    selectLanguage,
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
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