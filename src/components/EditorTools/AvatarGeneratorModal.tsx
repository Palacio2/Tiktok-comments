import React from 'react';
import { Icons, Button, Input, Modal } from '@/components/ui';
import { useAvatarGenerator } from '@/hooks/useAvatarGenerator';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (img: string) => void;
}

const AvatarGeneratorModal: React.FC<Props> = ({ isOpen, onClose, onApply }) => {
  const { t } = useLanguage();
  
  const handleApplyWithToast = (img: string) => {
    onApply(img);
    toast.success(t.avatarSuccess || 'Аватар застосовано!');
    onClose();
  };

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

      <div className="p-6 flex flex-col items-center gap-6">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg">
          {previewImage ? (
            <img src={previewImage} alt="AI Avatar Preview" className="w-full h-full object-cover" />
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
          <div className="grid grid-cols-2 gap-3">
            <Button variant="primary" onClick={handleGenerate} disabled={isLoading || !promptText.trim()} className="h-12 text-sm">
              {isLoading ? (status || "...") : (t.generate || "Малювати")}
            </Button>
            <Button 
              variant="tiktok" 
              onClick={() => previewImage && handleApplyWithToast(previewImage)} 
              disabled={isLoading || !previewImage} 
              className="h-12 text-sm"
            >
              {t.apply || "Застосувати"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AvatarGeneratorModal;