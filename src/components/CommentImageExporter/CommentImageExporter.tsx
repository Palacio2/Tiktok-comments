import { useRef, useState } from 'react';
import { toPng, toSvg, toBlob } from 'html-to-image';
import { CommentData, ExportSettings } from '@/types';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/hooks';
import { toast } from 'sonner';
import CommentView from '../CommentView/CommentView';
import { trackEvent } from '@/utils/analytics';

interface Props {
  data: CommentData;
  settings: ExportSettings;
  onLiveUpdate?: (field: keyof CommentData, value: any) => void;
  activeEditId?: string;
  onSelectEdit?: (id: string) => void;
  onAddReply?: (replyToUsername?: string) => void;
  onAvatarClick?: () => void;
}

const CommentImageExporter = ({ data, settings, onLiveUpdate, activeEditId, onSelectEdit, onAddReply, onAvatarClick }: Props) => {
  const { t } = useLanguage();
  const exportRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const getOptions = () => {
    const isCustom = settings.customSize;
    const reqWidth = isCustom && settings.width !== 'auto' ? Number(settings.width) : exportRef.current?.offsetWidth || 0;
    const reqHeight = isCustom && settings.height !== 'auto' ? Number(settings.height) : exportRef.current?.offsetHeight || 0;

    return {
      backgroundColor: settings.isTransparent ? 'rgba(0,0,0,0)' : (settings.isDark ? '#121212' : '#FFFFFF'),
      pixelRatio: 2,
      canvasWidth: reqWidth,
      canvasHeight: reqHeight,
      style: isCustom ? {
        width: `${reqWidth}px`,
        height: `${reqHeight}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      } : {},
      filter: (node: HTMLElement) => !node.classList?.contains('no-export')
    };
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    
    trackEvent('download_comment', { 
      format: settings.format, 
      with_watermark: settings.showWatermark 
    });

    const exportPromise = async () => {
      const options = getOptions();
      const dataUrl = settings.format === 'svg' 
        ? await toSvg(exportRef.current!, options)
        : await toPng(exportRef.current!, options);
      const link = document.createElement('a');
      link.download = `tiktok-comment-${Date.now()}.${settings.format}`;
      link.href = dataUrl;
      link.click();
    };
    
    toast.promise(exportPromise(), {
      loading: t('loading'),
      success: t('exportSuccess'),
      error: t('exportError')
    });
  };

  const handleCopy = async () => {
    if (!exportRef.current) return;
    
    trackEvent('copy_comment', { 
      format: settings.format, 
      with_watermark: settings.showWatermark 
    });

    const copyPromise = async () => {
      const options = getOptions();
      const blob = await toBlob(exportRef.current!, options);
      if (!blob) throw new Error();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    
    toast.promise(copyPromise(), {
      loading: t('loading'),
      success: t('copied'),
      error: t('copyError')
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 w-full max-w-2xl mx-auto">
      <div className="w-full flex justify-center overflow-visible">
        <div 
          ref={exportRef} 
          className={`rounded-[24px] sm:rounded-[28px] transition-all flex items-center justify-center overflow-hidden w-full relative ${settings.isTransparent ? 'shadow-none bg-transparent bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgvwMDwnxhMQApgGMDAoK+PXxZh0wkYMA6jYRQMFMDwkHw18jAAAwCOiBk/y1Y6rAAAAABJRU5ErkJggg==")]' : 'shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]'}`}
          style={{
            aspectRatio: settings.customSize && settings.width !== 'auto' && settings.height !== 'auto' ? `${settings.width}/${settings.height}` : 'auto',
            backgroundColor: settings.isTransparent ? 'transparent' : (settings.isDark ? '#121212' : '#FFFFFF'),
            padding: settings.customSize ? '2rem' : '0'
          }}
        >
          <div className="w-full max-w-[500px] relative z-10">
            <CommentView 
              data={data} 
              isDark={settings.isDark} 
              onLiveUpdate={onLiveUpdate}
              activeEditId={activeEditId}
              onSelectEdit={onSelectEdit}
              onAddReply={onAddReply}
              onAvatarClick={onAvatarClick}
            />
          </div>
          {settings.showWatermark && (
            <div className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-center z-20 opacity-20 overflow-hidden rotate-[-15deg] scale-125">
               {Array.from({ length: 48 }).map((_, i) => (
                <span key={i} className="text-[14px] sm:text-[18px] font-black text-slate-500 mx-3 my-2 whitespace-nowrap uppercase tracking-widest">TikTokGen.online</span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-row w-full max-w-lg gap-3">
        <button 
          onClick={handleCopy} 
          className="flex-1 flex items-center justify-center h-12 sm:h-14 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-[14px] sm:text-[15px] shadow-sm hover:bg-slate-50 transition-all active:scale-95"
        >
          {copied ? <Icons.Verified className="mr-1.5 text-emerald-500" size={18} /> : <Icons.Topic className="mr-1.5 text-slate-400" size={18} />}
          <span className="truncate">{copied ? t('copied') : t('copyImage')}</span>
        </button>
        
        <button 
          onClick={handleExport} 
          className="flex-1 flex items-center justify-center h-12 sm:h-14 rounded-2xl bg-gradient-to-r from-[#00f2ea] to-[#00ff85] text-slate-900 font-extrabold text-[14px] sm:text-[15px] shadow-[0_8px_16px_-6px_rgba(0,242,234,0.4)] hover:opacity-90 transition-all active:scale-95"
        >
          <Icons.Download className="mr-1.5" size={18} />
          <span className="truncate">{t('downloadBtn')}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentImageExporter;