import { useState, useEffect, useCallback } from 'react';
import { loadComments, saveComment, clearComments as clearStorage } from '../utils/storage';
import { translations } from '../utils/translations';
import { supabase } from '../utils/supabaseClient';

// === Хук для Мови ===
export const useLanguage = () => {
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

  return { language, t, isLangMenuOpen, currentLangObj, LANGUAGES, toggleLangMenu, selectLanguage };
};

// === Хук для PRO (З ТАЙМЕРОМ) ===
export const usePro = () => {
  const [isPro, setIsPro] = useState(() => localStorage.getItem('isProUser') === 'true');
  const [expirationDate, setExpirationDate] = useState(() => localStorage.getItem('proExpirationDate'));
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleBuyPro = useCallback(() => {
    const stripeUrl = import.meta.env.VITE_STRIPE_URL || '#';
    window.open(stripeUrl, '_blank');
  }, []);

  const activatePro = useCallback(async (code) => {
    setIsValidating(true);
    const cleanCode = code.trim().toUpperCase();

    try {
      // ✅ Викликаємо нову SQL функцію, яка повертає ДАТУ
      const { data, error } = await supabase
        .rpc('check_license_date', { lookup_code: cleanCode });

      if (error) {
        console.error('Supabase error:', error);
        setIsValidating(false);
        return false;
      }

      // Якщо data != null, значить код валідний і ми отримали дату
      if (data) {
        setIsPro(true);
        setExpirationDate(data);
        localStorage.setItem('isProUser', 'true');
        localStorage.setItem('proExpirationDate', data);
        setIsSubModalOpen(false);
        setIsValidating(false);
        return true; 
      } else {
        setIsValidating(false);
        return false;
      }
    } catch (err) {
      console.error('Network error:', err);
      setIsValidating(false);
      return false;
    }
  }, []);

  // Перевірка терміну дії при запуску
  useEffect(() => {
    if (expirationDate) {
      const now = new Date();
      const end = new Date(expirationDate);
      if (now > end) {
        setIsPro(false);
        setExpirationDate(null);
        localStorage.removeItem('isProUser');
        localStorage.removeItem('proExpirationDate');
      }
    }
  }, [expirationDate]);

  return { isPro, expirationDate, isSubModalOpen, setIsSubModalOpen, handleBuyPro, activatePro, isValidating };
};

// === Хук для Темної Теми ===
export const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
};

// === Хук для Історії ===
export const useHistory = () => {
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState(null);

  useEffect(() => {
    setComments(loadComments());
  }, []);

  const handleGenerateComment = useCallback((commentData) => {
    let finalDate = commentData.date ? new Date(commentData.date).toISOString() : new Date().toISOString();
    const newComment = { ...commentData, id: crypto.randomUUID(), date: finalDate };
    const updatedComments = saveComment(newComment);
    setCurrentComment(newComment);
    setComments(updatedComments);
  }, []);

  const clearHistory = useCallback((t, language) => {
    if (comments.length === 0) return;
    const confirmMsg = language === 'uk' ? 'Видалити історію?' : 'Clear history?';
    if (window.confirm(confirmMsg)) {
      clearStorage();
      setComments([]);
      setCurrentComment(null);
    }
  }, [comments.length]);

  return { comments, currentComment, handleGenerateComment, clearHistory };
};