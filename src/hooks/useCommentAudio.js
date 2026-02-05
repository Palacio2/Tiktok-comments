import { useState } from 'react';
import { supabase } from '@utils';

export const useCommentAudio = () => {
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const generateAndDownload = async (text, language) => {
    if (!text) return;
    setIsGeneratingAudio(true);

    try {
      // Вибираємо голос залежно від мови
      const voice = language === 'uk' ? 'uk_001' : 'en_us_001';

      const { data, error } = await supabase.functions.invoke('generate-tts', {
        body: { text, voice }
      });

      if (error) throw error;

      if (data?.audio) {
        // Програємо отримане аудіо (base64)
        const audio = new Audio(`data:audio/mpeg;base64,${data.audio}`);
        audio.play();
      }
    } catch (err) {
      console.error("TTS Error:", err);
      // Fallback на браузерний синтез, якщо Edge Function не спрацювала
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'uk' ? 'uk-UA' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return { generateAndDownload, isGeneratingAudio };
};