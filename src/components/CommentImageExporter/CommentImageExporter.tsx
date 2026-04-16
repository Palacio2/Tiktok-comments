import { useRef } from 'react';
import { toPng, toSvg } from 'html-to-image';
import { CommentData, ExportSettings } from '@/types';
import { Button, Icons } from '@/components/ui';
import { TranslationSchema } from '@/utils/translations';
import { useLoader } from '@/hooks/useLoader'; // Імпортуємо наш хук
import CommentView from '../CommentView/CommentView';

interface Props {
  data: CommentData;
  settings: ExportSettings;
  t: TranslationSchema;
}

const CommentImageExporter = ({ data, settings, t }: Props) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const { showLoader, hideLoader } = useLoader(); // Використовуємо глобальний лоадер

  const handleExport = async () => {
    if (!exportRef.current) return;

    // Включаємо глобальний лоадер
    showLoader(t.loading || 'Завантаження...');

    try {
      const filter = (node: HTMLElement) => {
        return !node.classList?.contains('no-export');
      };

      const options = {
        backgroundColor: settings.isDark ? '#121212' : '#FFFFFF',
        pixelRatio: 2,
        filter
      };

      const dataUrl = settings.format === 'svg' 
        ? await toSvg(exportRef.current, options)
        : await toPng(exportRef.current, options);

      const link = document.createElement('a');
      link.download = `tiktok-comment-${Date.now()}.${settings.format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      // Вимикаємо глобальний лоадер незалежно від того успішно чи помилка
      hideLoader();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="card-preview w-full">
        <div ref={exportRef} className="card-preview-inner w-full">
          <CommentView data={data} isDark={settings.isDark} t={t} />
        </div>
      </div>

      <Button 
        onClick={handleExport}
        className="w-full max-w-lg h-16 text-[16px] shadow-md hover:shadow-lg transition-all"
        size="lg"
      >
        <Icons.Download className="mr-2.5" size={20} />
        {t?.downloadBtn || 'Завантажити'}
      </Button>
    </div>
  );
};

export default CommentImageExporter;