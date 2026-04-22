import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button, Input, Icons } from '@/components/ui';
import { useAiGenerator, useLanguage, usePro } from '@/hooks';
import { AI_LANGUAGES } from '@/constants';
import { toast } from 'sonner';

interface AiGeneratorProps {
  onGenerate: (text: string) => void;
}

const AiGenerator: React.FC<AiGeneratorProps> = ({ onGenerate }) => {
  const { t } = useLanguage();
  const { isPro, openPro } = usePro();
  
  // Додаємо стейти для плавної анімації
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState('funny');
  const [length, setLength] = useState('short');
  const [language, setLanguage] = useState('ukrainian');

  const { generateComment, isLoading } = useAiGenerator(isPro);

  const MOODS = [
    { id: 'funny', label: t('aiMoods.funny') },
    { id: 'hater', label: t('aiMoods.hater') },
    { id: 'sarcastic', label: t('aiMoods.sarcastic') },
    { id: 'supportive', label: t('aiMoods.supportive') }
  ];

  // Логіка для плавного монтування/розмонтування
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target === e.currentTarget && !isOpen) {
      setIsMounted(false);
    }
  };

  const handleAction = async () => {
    if (!isPro) {
      toast.error(t('getProModalTitle'));
      openPro();
      return;
    }
    if (!prompt.trim()) {
      toast.error(t('aiPromptError'));
      return;
    }

    try {
      const result = await generateComment({ topic: prompt, mood, length, language });
      if (result) {
        onGenerate(result);
        setIsOpen(false);
        toast.success(t('aiSuccess'));
      }
    } catch (err: any) {
      toast.error(err.message || t('aiError'));
    }
  };

  return (
    <>
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 h-11 sm:h-10 text-[11px] uppercase font-bold transition-all rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm hover:opacity-90 active:scale-95"
      >
        <Icons.Sparkles size={14} />
        <span>{t('aiAssist')}</span>
        {!isPro && <Icons.Lock size={12} className="ml-0.5" />}
      </button>

      {/* Замість isOpen використовуємо isMounted для рендеру */}
      {isMounted && createPortal(
        <div 
          className={`fixed inset-0 z-[99999] flex justify-center max-sm:items-end sm:items-center sm:p-4 transition-all duration-300 ease-out ${isVisible ? 'bg-slate-900/40 backdrop-blur-sm opacity-100' : 'bg-transparent backdrop-blur-none opacity-0 pointer-events-none'}`}
          onClick={() => setIsOpen(false)}
          onTransitionEnd={handleTransitionEnd}
        >
          <div 
            className={`bg-white w-full max-w-md max-sm:rounded-t-[32px] max-sm:rounded-b-none sm:rounded-[32px] shadow-2xl overflow-hidden transition-all duration-300 ease-out flex flex-col max-sm:mt-auto max-h-[90vh] ${isVisible ? 'max-sm:translate-y-0 sm:scale-100 sm:opacity-100' : 'max-sm:translate-y-full sm:scale-95 sm:opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-[17px] sm:text-lg font-bold flex items-center gap-2 text-slate-900">
                <Icons.Sparkles className="text-violet-500" size={20} />
                {t('aiAssist')}
              </h3>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-all bg-white shadow-sm border border-slate-100">
                <Icons.X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6 max-sm:max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="flex flex-wrap gap-2">
                {AI_LANGUAGES.map(lang => (
                  <button key={lang.id} onClick={() => setLanguage(lang.id)} className={`px-4 py-2.5 sm:py-2 rounded-xl text-[13px] font-semibold transition-all border ${language === lang.id ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {lang.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {MOODS.map(m => (
                  <button key={m.id} onClick={() => setMood(m.id)} className={`px-4 py-2.5 sm:py-2 rounded-xl text-[13px] font-semibold transition-all border ${mood === m.id ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {m.label}
                  </button>
                ))}
              </div>

              <Input
                placeholder={t('commentPlaceholder')}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 max-sm:pb-8">
              <Button variant="tiktok" onClick={handleAction} isLoading={isLoading} className="w-full h-14 sm:h-12 text-[15px] rounded-2xl shadow-sm">
                {t('generate')}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default AiGenerator;