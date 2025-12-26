import { useState } from 'react';
import { enhanceAvatarPrompt, generateAvatarUrl } from '../services/aiService';
import { urlToBase64 } from '../utils/helpers'; // ✅ Використовуємо центральну утиліту

export const useAvatarGenerator = (onApply, onClose) => {
  const [promptText, setPromptText] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    if (!promptText.trim()) return;
    
    setIsLoading(true);
    setPreviewImage(null);
    setStatus('🧠 Оптимізація...');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    try {
      const optimizedPrompt = await enhanceAvatarPrompt(promptText, apiKey);
      setStatus('🎨 Малюю...');
      const imageUrl = generateAvatarUrl(optimizedPrompt);
      const base64Image = await urlToBase64(imageUrl);
      setPreviewImage(base64Image);
    } catch (err) {
      console.error("Generation Error:", err);
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
    onClose();
  };

  return {
    promptText, setPromptText, previewImage, isLoading, status, handleGenerate, handleApply, handleClose
  };
};