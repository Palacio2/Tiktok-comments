import { useState, useCallback, createContext, useContext } from 'react';
import { translations } from '@utils';

// 1. Створюємо контекст
const LanguageContext = createContext(null);

// 2. Створюємо Провайдер (обгортку)
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('uk');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const LANGUAGES = [
    { code: 'uk', label: 'Українська', countryCode: 'ua' },
    { code: 'en', label: 'English', countryCode: 'us' },
    { code: 'pl', label: 'Polski', countryCode: 'pl' },
    { code: 'fr', label: 'Français', countryCode: 'fr' },
    { code: 'ru', label: 'Русский', countryCode: 'ru' },
  ];

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const t = translations[language];

  const toggleLangMenu = useCallback(() => setIsLangMenuOpen(prev => !prev), []);
  
  const selectLanguage = useCallback((code) => {
    setLanguage(code);
    setIsLangMenuOpen(false);
  }, []);

  // Значення, які будуть доступні всім компонентам
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

// 3. Створюємо хук для зручного доступу
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};