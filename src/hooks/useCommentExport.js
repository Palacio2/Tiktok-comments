import { useState, useCallback } from 'react';
import { toPng, toSvg, toBlob } from 'html-to-image';
import { useLanguage } from './useLanguage';

export const useCommentExport = ({ exportRef, exportSettings }) => {
  const { t, language } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);

  // Копіювання в буфер (Clipboard)
  const copyToClipboard = useCallback(async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      // Спроба високої якості
      let blob;
      try {
        blob = await toBlob(exportRef.current, { pixelRatio: 2, backgroundColor: exportSettings.isDark ? '#121212' : 'white' });
      } catch (e) {
        console.warn('High-res copy failed, fallback to standard', e);
        blob = await toBlob(exportRef.current, { pixelRatio: 1, backgroundColor: exportSettings.isDark ? '#121212' : 'white' });
      }

      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      alert(t.copied || 'Copied!');
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Copy failed. Try downloading.");
    } finally {
      setIsExporting(false);
    }
  }, [exportRef, t, exportSettings]);

  // Завантаження файлу
  const handleExport = useCallback(async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    
    try {
      // Для експорту беремо масштаб 2x для чіткості (Retina)
      const pixelRatio = (exportSettings.width > 1500 || exportSettings.format === 'svg') ? 1 : 2;
      const bgColor = exportSettings.isDark ? '#121212' : 'white';
      
      const width = exportRef.current.offsetWidth;
      const height = exportRef.current.offsetHeight;

      const options = {
        width: width,
        height: height,
        backgroundColor: bgColor,
        quality: 1.0,
        pixelRatio: pixelRatio,
        cacheBust: true,
        style: { transform: 'none', margin: 0 }
      };
      
      let dataUrl;
      let fileExtension;
      
      if (exportSettings.format === 'svg') {
        dataUrl = await toSvg(exportRef.current, options);
        fileExtension = 'svg';
      } else {
        // Fallback логіка для PNG
        try {
          dataUrl = await toPng(exportRef.current, options);
        } catch (err) {
           console.warn('High-res export failed, retrying standard res');
           options.pixelRatio = 1;
           dataUrl = await toPng(exportRef.current, options);
        }
        fileExtension = 'png';
      }
      
      const link = document.createElement('a');
      link.download = `tiktok-comment-${width}x${height}-${Date.now()}.${fileExtension}`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Export error:', error);
      const errorMsg = language === 'uk' ? 'Помилка експорту. Спробуйте інший браузер.' : 'Export failed.';
      alert(errorMsg);
    } finally {
      setIsExporting(false);
    }
  }, [exportRef, exportSettings, language]);

  return { handleExport, copyToClipboard, isExporting };
};