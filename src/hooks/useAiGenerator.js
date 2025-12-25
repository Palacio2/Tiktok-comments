import { useState } from 'react';
import { generateComment } from '../services/aiService';
import { translations } from '../utils/translations';

export const useAiGenerator = (onApply, onClose, language) => {
  const [settings, setSettings] = useState({
    topic: '',
    mood: 'positive',
    length: 'short'
  });
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language];

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Використовуємо функцію з aiService, яку ми створили раніше
      const text = await generateComment(settings, t);
      
      if (text) {
        setResult(text);
      } else {
        alert("Отримано порожню відповідь.");
      }
    } catch (error) {
      alert(`Помилка: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    onApply(result);
    onClose();
    setResult('');
  };

  const handleClose = () => {
    onClose();
    setResult('');
  };

  // Оновлення конкретного поля налаштувань
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    settings,
    updateSetting,
    result,
    setResult,
    isLoading,
    handleGenerate,
    handleAccept,
    handleClose
  };
};