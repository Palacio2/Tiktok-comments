import { useState, useCallback } from 'react';
import { toPng, toSvg } from 'html-to-image';
import { useTranslation } from 'react-i18next';

export const useCommentExporter = (exportRef, exportSettings, previewHeight) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!exportRef.current || isExporting) return;

    setIsExporting(true);

    try {
      const width = exportSettings.width || 1080;
      const height = exportSettings.customSize ? exportSettings.height : previewHeight;

      const options = {
        width: width,
        height: height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: 'white',
        },
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
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
      link.download = `tiktok-comment-${Date.now()}.${fileExtension}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export error:', error);
      alert(t('exportError', { format: exportSettings.format.toUpperCase() }));
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, previewHeight, t, exportSettings, exportRef]);

  return { isExporting, handleExport };
};
