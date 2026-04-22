import { useState, useCallback, createContext, useContext, ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface LanguageObj {
  code: string;
  label: string;
  countryCode: string;
}

interface LanguageContextType {
  language: string;
  t: (key: string, options?: any) => string;
  isLangMenuOpen: boolean;
  currentLangObj: LanguageObj;
  LANGUAGES: LanguageObj[];
  toggleLangMenu: () => void;
  selectLanguage: (code: string) => void;
}

const LANGUAGES: LanguageObj[] = [
  { code: 'uk', label: 'Українська', countryCode: 'ua' },
  { code: 'en', label: 'English', countryCode: 'us' },
  { code: 'pl', label: 'Polski', countryCode: 'pl' },
  { code: 'fr', label: 'Français', countryCode: 'fr' },
  { code: 'ru', label: 'Русский', countryCode: 'ru' },
];

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { t, i18n } = useTranslation();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const currentLangObj = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const toggleLangMenu = useCallback(() => setIsLangMenuOpen(prev => !prev), []);
  
  const selectLanguage = useCallback((code: string) => {
    i18n.changeLanguage(code); // Змінюємо мову через i18next
    setIsLangMenuOpen(false);
  }, [i18n]);

  const value = {
    language: i18n.language,
    t,
    isLangMenuOpen,
    currentLangObj,
    LANGUAGES,
    toggleLangMenu,
    selectLanguage,
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