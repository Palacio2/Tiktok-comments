import { useRef, useCallback } from 'react';

export const useFileUploader = (onFileSelect) => {
  const fileInputRef = useRef(null);

  const handlePick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Валідація: Макс 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл занадто великий! Максимум 5MB.");
      return;
    }

    // Валідація: Тільки картинки
    if (!file.type.startsWith('image/')) {
      alert("Будь ласка, завантажте зображення.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => onFileSelect(e.target.result);
    reader.readAsDataURL(file);
    
    // Скидаємо значення, щоб можна було вибрати той самий файл повторно
    event.target.value = '';
  }, [onFileSelect]);

  return { fileInputRef, handlePick, handleFileChange };
};