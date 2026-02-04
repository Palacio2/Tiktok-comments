import { useState } from 'react';
import { generateComment } from '@services/aiService';
import { useLanguage } from './useLanguage'; // Імпортуємо контекст

export const useAiGenerator = (onApply, onClose) => {
  // Більше не приймаємо language як аргумент, беремо з контексту
  const { t, language } = useLanguage();

  const [settings, setSettings] = useState({
    topic: '',
    mood: 'positive',
    length: 'short'
  });
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Передаємо language (код 'uk'), бо бекенд чекає рядок
      const text = await generateComment(settings, language);
      setResult(text);
    } catch (err) {
      console.error(err);
      setError(language === 'uk' ? 'Помилка генерації. Спробуйте пізніше.' : 'Generation failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    onApply(result);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setResult('');
    setError(null);
    setSettings(prev => ({ ...prev, topic: '' }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  return {
    settings,
    updateSetting,
    result,
    setResult,
    isLoading,
    error,
    handleGenerate,
    handleAccept,
    handleClose
  };
};