import { useState } from 'react';
import { enhanceAvatarPrompt, generateAvatarUrl } from '@services/aiService';
import { urlToBase64 } from '@utils/helpers';

export const useAvatarGenerator = (onApply, onClose) => {
  const [promptText, setPromptText] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!promptText.trim()) return;
    
    setIsLoading(true);
    setPreviewImage(null);
    setError(null);
    setStatus('🧠 Оптимізація...');

    try {
      // Ключ більше не потрібен, логіка на бекенді Supabase
      const optimizedPrompt = await enhanceAvatarPrompt(promptText);
      
      setStatus('🎨 Малюю...');
      const imageUrl = generateAvatarUrl(optimizedPrompt);
      
      // urlToBase64 тепер використовує проксі, якщо треба
      const base64Image = await urlToBase64(imageUrl);
      
      if (!base64Image) throw new Error('Failed to load image');
      
      setPreviewImage(base64Image);
    } catch (err) {
      console.error("Generation Error:", err);
      setError('Не вдалося згенерувати. Спробуйте інший опис.');
      // Fallback: DiceBear (аватар за посиланням)
      const seed = encodeURIComponent(promptText);
      setPreviewImage(`https://api.dicebear.com/9.x/notionists/svg?seed=${seed}`);
    } finally {
      setIsLoading(false);
      setStatus('');
    }
  };

  const handleApply = () => {
    if (previewImage) {
      onApply(previewImage);
      handleClose();
    }
  };

  const handleClose = () => {
    setPromptText('');
    setPreviewImage(null);
    setStatus('');
    setError(null);
    onClose();
  };

  return {
    promptText, 
    setPromptText, 
    previewImage, 
    isLoading, 
    status, 
    error,
    handleGenerate, 
    handleApply, 
    handleClose
  };
};