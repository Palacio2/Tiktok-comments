import { useState, useEffect, useCallback } from 'react';
import { loadComments, saveComment, clearComments as clearStorage } from '../utils/storage';
import { translations } from '../utils/translations';
import { supabase } from '../utils/supabaseClient'; // 🆕 Імпорт клієнта

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

  const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);
  const selectLanguage = (code) => {
    setLanguage(code);
    setIsLangMenuOpen(false);
  };

  return { language, t, isLangMenuOpen, currentLangObj, LANGUAGES, toggleLangMenu, selectLanguage };
};

// === Хук для PRO (Оновлений під Supabase) ===
export const usePro = () => {
  const [isPro, setIsPro] = useState(() => localStorage.getItem('isProUser') === 'true');
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false); // 🆕 Стейт завантаження

  const handleBuyPro = () => {
    // Тут буде ваше посилання на Stripe
    window.open('https://buy.stripe.com/test_cNifZg6We0radiraeU9sk00', '_blank');
  };

  // Функція активації через Supabase
  const activatePro = async (code) => {
    setIsValidating(true);
    const cleanCode = code.trim().toUpperCase();

    try {
      // Викликаємо SQL функцію 'check_license'
      const { data, error } = await supabase
        .rpc('check_license', { lookup_code: cleanCode });

      if (error) {
        console.error('Supabase error:', error);
        setIsValidating(false);
        return false;
      }

      // Якщо функція повернула true (код знайдено)
      if (data === true) {
        setIsPro(true);
        localStorage.setItem('isProUser', 'true');
        setIsSubModalOpen(false);
        setIsValidating(false);
        return true; 
      } else {
        // Код не знайдено
        setIsValidating(false);
        return false;
      }
    } catch (err) {
      console.error('Network error:', err);
      setIsValidating(false);
      return false;
    }
  };

  return { isPro, isSubModalOpen, setIsSubModalOpen, handleBuyPro, activatePro, isValidating };
};

// === Хук для Темної Теми ===
export const useTheme = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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

  const clearHistory = (t, language) => {
    if (comments.length === 0) return;
    const confirmMsg = language === 'uk' ? 'Видалити історію?' : 'Clear history?';
    if (window.confirm(confirmMsg)) {
      clearStorage();
      setComments([]);
      setCurrentComment(null);
    }
  };

  return { comments, currentComment, handleGenerateComment, clearHistory };
};