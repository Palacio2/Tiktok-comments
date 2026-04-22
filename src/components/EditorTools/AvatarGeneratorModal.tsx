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
    toast.success(t('avatarSuccess'));
    onClose();
  };

  const { promptText, setPromptText, previewImage, isLoading, status, handleGenerate, handleClose } = useAvatarGenerator(onApply, onClose);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="border border-slate-100 shadow-2xl max-sm:!rounded-b-none max-sm:!rounded-t-[32px] max-sm:!mt-auto">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="text-[17px] sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Icons.Sparkles className="text-slate-900" size={20} /> {t('aiAvatarTitle')}
        </h3>
        <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-all bg-white shadow-sm border border-slate-100">
          <Icons.X size={18} />
        </button>
      </div>

      <div className="p-5 sm:p-6 flex flex-col items-center gap-6 max-sm:pb-8">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center border-4 border-white shadow-lg shrink-0">
          {previewImage ? (
            <img src={previewImage} alt="AI Avatar Preview" className="w-full h-full object-cover" />
          ) : (
            <Icons.User size={56} className="text-slate-300" />
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <span className="w-8 h-8 border-4 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        <div className="w-full flex flex-col gap-4">
          <Input 
            placeholder={t('aiAvatarPrompt')}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isLoading}
            className="bg-slate-50 border-slate-100 w-full h-12 sm:h-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="primary" onClick={handleGenerate} disabled={isLoading || !promptText.trim()} className="h-14 sm:h-12 text-[15px] sm:text-sm rounded-2xl">
              {isLoading ? status : t('generate')}
            </Button>
            <Button 
              variant="tiktok" 
              onClick={() => previewImage && handleApplyWithToast(previewImage)} 
              disabled={isLoading || !previewImage} 
              className="h-14 sm:h-12 text-[15px] sm:text-sm rounded-2xl"
            >
              {t('apply')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AvatarGeneratorModal;