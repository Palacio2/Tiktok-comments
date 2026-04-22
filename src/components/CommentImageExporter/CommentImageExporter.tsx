import { useRef, useState } from 'react';
import { toPng, toSvg, toBlob } from 'html-to-image';
import { CommentData, ExportSettings } from '@/types';
import { Button, Icons } from '@/components/ui';
import { useLanguage } from '@/hooks';
import { toast } from 'sonner';
import CommentView from '../CommentView/CommentView';

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
      loading: t.loading || '...',
      success: t.exportSuccess || 'Success',
      error: t.exportError || 'Error'
    });
  };

  const handleCopy = async () => {
    if (!exportRef.current) return;
    const copyPromise = async () => {
      const options = getOptions();
      const blob = await toBlob(exportRef.current!, options);
      if (!blob) throw new Error();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    toast.promise(copyPromise(), {
      loading: t.loading || '...',
      success: t.copied || 'Success',
      error: t.copyError || 'Error'
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full flex justify-center overflow-visible">
        <div 
          ref={exportRef} 
          className={`rounded-[28px] transition-all flex items-center justify-center overflow-hidden w-full relative ${settings.isTransparent ? 'shadow-none bg-transparent bg-[url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgvwMDwnxhMQApgGMDAoK+PXxZh0wkYMA6jYRQMFMDwkHw18jAAAwCOiBk/y1Y6rAAAAABJRU5ErkJggg==")]' : 'shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]'}`}
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
                <span key={i} className="text-[18px] font-black text-slate-500 mx-4 my-2 whitespace-nowrap uppercase tracking-widest">TikTokGen.online</span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full max-w-lg gap-3">
        <Button onClick={handleCopy} variant="secondary" className="flex-1 h-14 rounded-2xl bg-white">
          {copied ? <Icons.Verified className="mr-2 text-emerald-500" size={18} /> : <Icons.Topic className="mr-2" size={18} />}
          {copied ? (t.copied || 'Done') : (t.copyImage || 'Copy')}
        </Button>
        <Button onClick={handleExport} className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#00f2ea] to-[#00ff85] text-slate-900 border-0">
          <Icons.Download className="mr-2" size={18} />
          {t.downloadBtn}
        </Button>
      </div>
    </div>
  );
};

export default CommentImageExporter;