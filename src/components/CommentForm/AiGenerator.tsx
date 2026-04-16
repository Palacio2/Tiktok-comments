import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Input, Icons } from '@/components/ui';
import { useAiGenerator } from '@/hooks/useAiGenerator';
import { TranslationSchema } from '@/utils/translations';

interface AiGeneratorProps {
  onGenerate: (text: string) => void;
  isPro: boolean;
  onOpenPro: () => void;
  t: TranslationSchema;
}

const LANGUAGES = [
  { id: 'ukrainian', label: '🇺🇦 Українська' },
  { id: 'english', label: '🇬🇧 English' },
  { id: 'polish', label: '🇵🇱 Polski' }
];

const AiGenerator: React.FC<AiGeneratorProps> = ({ onGenerate, isPro, onOpenPro, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [mood, setMood] = useState('funny');
  const [length, setLength] = useState('short');
  const [language, setLanguage] = useState('ukrainian');

  const { generateComment, isLoading } = useAiGenerator(isPro);

  const MOODS = [
    { id: 'funny', label: t.aiMoods?.funny || '😂 Смішний' },
    { id: 'hater', label: t.aiMoods?.hater || '😡 Хейтер' },
    { id: 'supportive', label: t.aiMoods?.supportive || '😍 Підтримка' },
    { id: 'sarcastic', label: t.aiMoods?.sarcastic || '😏 Сарказм' },
    { id: 'question', label: t.aiMoods?.question || '🤔 Питання' }
  ];

  const LENGTHS = [
    { id: 'short', label: t.aiLengths?.short || 'Короткий' },
    { id: 'medium', label: t.aiLengths?.medium || 'Середній' },
    { id: 'long', label: t.aiLengths?.long || 'Довгий' }
  ];

  const handleOpen = () => {
    if (!isPro) {
      onOpenPro();
      return;
    }
    setIsOpen(true);
  };

  const handleAction = async () => {
    const result = await generateComment({ topic: prompt, mood, length, language });
    if (result) {
      onGenerate(result);
      setIsOpen(false);
      setPrompt('');
    }
  };

  return (
    <>
      <button 
        type="button"
        onClick={handleOpen}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-all duration-300 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
      >
        <Icons.Sparkles size={12} className="text-white" />
        <span>AI</span>
        {!isPro && <Icons.Lock size={10} className="text-slate-400" />}
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 flex flex-col max-h-[90vh] border border-slate-100" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 shrink-0">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Icons.Sparkles className="text-slate-900" /> {t.aiAssist || "AI Текст"}
              </h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
              >
                <Icons.X size={20} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.id}
                      onClick={() => setLanguage(l.id)}
                      className={`px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${language === l.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMood(m.id)}
                      className={`px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${mood === m.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {LENGTHS.map(len => (
                    <button
                      key={len.id}
                      onClick={() => setLength(len.id)}
                      className={`px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${length === len.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {len.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <Input
                  placeholder={t.commentPlaceholder || "Про що відео?"}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-50 border-slate-100"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 shrink-0">
              <Button 
                variant="tiktok" 
                onClick={handleAction} 
                isLoading={isLoading} 
                className="w-full h-12 text-base shadow-sm"
              >
                {t.generate || "Згенерувати"}
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