import React from 'react';
import { Icons, Button, Input, Modal } from '@/components/ui';
import { useAvatarGenerator } from '@/hooks/useAvatarGenerator';
import { useLanguage } from '@/hooks/useLanguage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (img: string) => void;
}

const AvatarGeneratorModal: React.FC<Props> = ({ isOpen, onClose, onApply }) => {
  const { t } = useLanguage();
  const { promptText, setPromptText, previewImage, isLoading, status, handleGenerate, handleClose } = useAvatarGenerator(onApply, onClose);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="border border-slate-100 shadow-xl shadow-slate-200/40">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icons.Sparkles className="text-slate-900" /> {t.aiAvatarTitle || "Створити аватар"}
        </h3>
        <button onClick={handleClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors">
          <Icons.X size={20} />
        </button>
      </div>

      <div className="p-8 flex flex-col items-center gap-8">
        <div className={`relative w-40 h-40 rounded-full border-4 border-slate-50 shadow-sm flex items-center justify-center overflow-hidden bg-slate-100 transition-all duration-500 ${isLoading ? 'animate-pulse scale-95' : 'scale-100'}`}>
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="w-full h-full object-cover animate-in fade-in zoom-in" />
          ) : (
            <Icons.User size={64} className="text-slate-300" />
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <span className="w-8 h-8 border-4 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        <div className="w-full space-y-4">
          <Input 
            placeholder={t.aiAvatarPrompt || "Напр. кіт у кіберпанк стилі..."}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isLoading}
            className="bg-slate-50 border-slate-100 w-full"
          />
          <Button variant="tiktok" onClick={handleGenerate} disabled={isLoading || !promptText.trim()} className="w-full h-12 text-base shadow-sm">
            {isLoading ? (status || "Малюю...") : (t.generate || "Згенерувати")}
          </Button>
        </div>
      </div>

      <div className="p-6 bg-slate-50/50 flex gap-3 border-t border-slate-100">
        <Button variant="ghost" onClick={handleClose} className="flex-1 h-12 text-[15px]">{t.cancel || "Скасувати"}</Button>
        <Button variant="primary" onClick={() => previewImage && onApply(previewImage)} disabled={!previewImage || isLoading} className="flex-1 h-12 text-[15px]">
          {t.apply || "Застосувати"}
        </Button>
      </div>
    </Modal>
  );
};

export default AvatarGeneratorModal;