import React, { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
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
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] uppercase font-bold transition-all rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
      >
        <Icons.Sparkles size={12} />
        <span>{t('aiAssist')}</span>
        {!isPro && <Icons.Lock size={10} />}
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Icons.Sparkles className="text-violet-500" size={20} />
                {t('aiAssist')}
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-900">
                <Icons.X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                {AI_LANGUAGES.map(lang => (
                  <button key={lang.id} onClick={() => setLanguage(lang.id)} className={`px-3 py-2 rounded-xl text-[13px] font-semibold transition-all border ${language === lang.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}>
                    {lang.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {MOODS.map(m => (
                  <button key={m.id} onClick={() => setMood(m.id)} className={`px-3 py-2 rounded-xl text-[13px] font-semibold ${mood === m.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500'}`}>
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

            <div className="p-6 bg-slate-50 border-t">
              <Button variant="tiktok" onClick={handleAction} isLoading={isLoading} className="w-full h-12">
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