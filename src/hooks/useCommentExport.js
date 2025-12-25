import { useState, useCallback } from 'react';
import { toPng, toSvg, toBlob } from 'html-to-image';

export const useCommentExport = ({ exportRef, exportSettings, isPro, onOpenPro, language, previewHeight, translations }) => {
  const [isExporting, setIsExporting] = useState(false);

  // 🆕 Копіювання в буфер
  const copyToClipboard = useCallback(async () => {
    if (!exportRef.current) return;
    setIsExporting(true);
    try {
      // Для кращої якості (x2)
      const blob = await toBlob(exportRef.current, { pixelRatio: 2, backgroundColor: exportSettings.isDark ? '#121212' : 'white' });
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      alert(translations.copied || 'Copied!');
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Copy failed. Try downloading.");
    } finally {
      setIsExporting(false);
    }
  }, [exportRef, translations, exportSettings.isDark]);

  const handleExport = useCallback(async () => {
    if (exportSettings.format === 'svg' && !isPro) {
      onOpenPro();
      return;
    }

    if (!exportRef.current || isExporting) return;
    setIsExporting(true);
    
    try {
      const width = parseInt(exportSettings.width) || 1080;
      const height = exportSettings.customSize ? parseInt(exportSettings.height) : previewHeight;
      const pixelRatio = (exportSettings.customSize || exportSettings.format === 'svg') ? 1 : 2;
      const bgColor = exportSettings.isDark ? '#121212' : 'white'; // 🆕 Врахування теми

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
        dataUrl = await toPng(exportRef.current, options);
        fileExtension = 'png';
      }
      
      const link = document.createElement('a');
      link.download = `tiktok-comment-${width}x${height}-${Date.now()}.${fileExtension}`;
      link.href = dataUrl;
      link.click();
      
    } catch (error) {
      console.error('Export error:', error);
      const errorMsg = language === 'uk' ? 'Помилка експорту' : 'Export failed';
      alert(errorMsg);
    } finally {
      setIsExporting(false);
    }
  }, [exportRef, isExporting, previewHeight, language, exportSettings, isPro, onOpenPro]);

  return { isExporting, handleExport, copyToClipboard };
};