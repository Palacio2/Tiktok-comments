import { useState } from 'react';

export const useCommentAudio = () => {
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const generateAndDownload = (text, language) => {
    if (!text) return;
    setIsGeneratingAudio(true);

    // Використовуємо вбудований API браузера
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Налаштування голосу
    utterance.lang = language === 'uk' ? 'uk-UA' : 'en-US';
    utterance.rate = 1.0; // Швидкість
    utterance.pitch = 1.0; // Тон

    // Подія завершення (хоча тут ми не скачуємо файл, а програємо)
    utterance.onend = () => {
      setIsGeneratingAudio(false);
    };

    utterance.onerror = (e) => {
      console.error("Speech Error:", e);
      setIsGeneratingAudio(false);
    };

    // Запуск
    window.speechSynthesis.cancel(); // Зупинити попередні
    window.speechSynthesis.speak(utterance);
    
    // Примітка: Скачування MP3 з браузерного API складне. 
    // Більшість таких інструментів просто програють звук.
    // Якщо критично саме скачати файл - треба підключати сторонні API (ElevenLabs тощо).
    // Для MVP програвання достатньо.
  };

  return { generateAndDownload, isGeneratingAudio };
};