import React, { useState } from 'react';
import { FormSection, Icons } from '@/components/ui';
import AiGenerator from '../EditorTools/AiGenerator';
import AvatarGeneratorModal from '../EditorTools/AvatarGeneratorModal';
import { useLanguage, usePro } from '@/hooks';

interface AiToolsSectionProps {
  textToEdit: string;
  onTextChange: (text: string) => void;
  onAvatarChange: (url: string | null) => void;
  onAddReply: () => void;
  onClear: () => void;
  onRandomize: () => void;
  isMainComment: boolean;
}

const AiToolsSection: React.FC<AiToolsSectionProps> = ({ 
  textToEdit, onTextChange, onAvatarChange, onAddReply, onClear, onRandomize, isMainComment
}) => {
  const { t } = useLanguage();
  const { isPro, openPro } = usePro();
  const [isAiAvatarOpen, setIsAiAvatarOpen] = useState(false);

  return (
    <FormSection title={t('aiAssist')} icon={<Icons.Sparkles size={18} className="text-slate-400" />}>
      <div className="flex flex-col gap-2.5 sm:gap-3">
        
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <AiGenerator onGenerate={onTextChange} />
          
          {/* ЗАМІНИВ Icons.Volume2 на Icons.MusicNote, щоб не було помилки */}
          <button 
            disabled
            className="flex items-center justify-center gap-2 h-11 sm:h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-[12px] font-bold cursor-not-allowed opacity-70"
          >
            <Icons.MusicNote size={14} className="text-slate-300" /> 
            <span className="truncate">{t('ttsModalTitle') || 'Voice'} (Soon)</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button 
            onClick={onRandomize}
            className="flex items-center justify-center gap-2 h-11 sm:h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-[12px] font-bold hover:bg-indigo-100 transition-all shadow-sm active:scale-95"
          >
            <Icons.Topic size={14} /> {t('randomComment')}
          </button>

          <button 
            onClick={onAddReply}
            className="flex items-center justify-center gap-2 h-11 sm:h-10 rounded-xl bg-white border border-slate-100 text-slate-700 text-[12px] font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Icons.Plus size={14} /> {t('addReply')}
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button 
            onClick={onClear}
            className={`flex items-center justify-center gap-2 h-11 sm:h-10 rounded-xl border transition-all shadow-sm active:scale-95 ${
              isMainComment 
                ? 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100' 
                : 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100'
            }`}
          >
            <Icons.Trash size={14} /> 
            {isMainComment ? t('clear') : t('cancel')}
          </button>

          <button 
            onClick={() => isPro ? setIsAiAvatarOpen(true) : openPro()}
            className="flex items-center justify-center gap-2 h-11 sm:h-10 rounded-xl bg-slate-900 text-white text-[12px] font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          >
            <Icons.User size={14} /> {t('aiAvatarTitle')}
          </button>
        </div>
      </div>

      <AvatarGeneratorModal 
        isOpen={isAiAvatarOpen} 
        onClose={() => setIsAiAvatarOpen(false)} 
        onApply={(img) => { 
          onAvatarChange(img); 
          setIsAiAvatarOpen(false); 
        }} 
      />
    </FormSection>
  );
};

export default AiToolsSection;