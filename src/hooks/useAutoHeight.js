import { useState, useEffect } from 'react';

export const useAutoHeight = (ref, exportSettings) => {
  const [previewHeight, setPreviewHeight] = useState(exportSettings.height);

  useEffect(() => {
    if (ref.current) {
      const updateHeight = () => {
        const contentHeight = ref.current.scrollHeight;
        if (exportSettings.customSize) {
          const fixedHeight = parseInt(exportSettings.height) || contentHeight;
          setPreviewHeight(fixedHeight);
        } else {
          setPreviewHeight(contentHeight);
        }
      };

      updateHeight();
      // Невеликий таймаут для гарантії, що стилі застосувались
      const timer = setTimeout(updateHeight, 50);
      return () => clearTimeout(timer);
    }
  }, [ref, exportSettings]); // Залежності: реф і налаштування

  return previewHeight;
};