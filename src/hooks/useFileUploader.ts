import { useRef, useCallback, ChangeEvent } from 'react';

export const useFileUploader = (onFileSelect: (base64: string | null) => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePick = () => fileInputRef.current?.click();

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Файл занадто великий! Максимум 2MB.");
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert("Будь ласка, завантажте зображення.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400; // Розмір для TikTok аватарок
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Зменшуємо якість до 0.8 для економії пам'яті (Base64 буде крихітним)
        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        onFileSelect(resizedBase64);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }, [onFileSelect]);

  return { fileInputRef, handlePick, handleFileChange };
};