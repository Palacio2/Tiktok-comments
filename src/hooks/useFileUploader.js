import { useRef, useCallback } from 'react';

export const useFileUploader = (onFileSelect) => {
  const fileInputRef = useRef(null);

  const handlePick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => onFileSelect(e.target.result);
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  return { fileInputRef, handlePick, handleFileChange };
};