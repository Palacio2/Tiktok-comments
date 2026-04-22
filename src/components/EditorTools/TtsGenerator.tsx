import React, { useState, useEffect } from 'react';
import { Icons, Modal, Button } from '@/components/ui';
import { useTtsGenerator, useTtsVoices, useLanguage, usePro } from '@/hooks';
import { toast } from 'sonner';

interface TtsGeneratorProps {
  text: string;
}

const TtsGenerator: React.FC<TtsGeneratorProps> = ({ text }) => {
  const { isPro, openPro } = usePro();
  const { t } = useLanguage();
  
  const { generateTts, isLoading: isGenerating } = useTtsGenerator(isPro);
  const { data: voices, isLoading: isVoicesLoading } = useTtsVoices();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');

  useEffect(() => {
    if (voices && voices.length > 0 && !selectedVoice) {
      setSelectedVoice(voices[0].id);
    }
  }, [voices, selectedVoice]);

  const handleOpen = () => {
    if (!isPro) {
      toast.error(t('getProModalTitle'));
      openPro();
      return;
    }
    if (!text.trim()) {
      toast.error(t('aiPromptError'));
      return;
    }
    setIsOpen(true);
  };

  const handleGenerate = async () => {
    if (!selectedVoice) return;
    
    const ttsPromise = async () => {
      const audioUrl = await generateTts({ text, voice: selectedVoice });
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `tiktok-voice-${Date.now()}.mp3`;
      link.click();
      setIsOpen(false);
    };

    toast.promise(ttsPromise(), {
      loading: t('ttsLoading'),
      success: t('ttsSuccess'),
      error: (err: unknown) => {
        if (err instanceof Error) return err.message;
        return t('ttsError');
      },
    });
  };

  return (
    <>
      <button 
        type="button"
        onClick={handleOpen}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold transition-all duration-300 rounded-lg bg-[#20D5EC] text-white hover:bg-[#1cbcd1] shadow-sm"
      >
        <Icons.Mic size={12} className="text-white" />
        <span>TTS</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => !isGenerating && setIsOpen(false)} className="border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Icons.Mic className="text-[#20D5EC]" /> {t('ttsModalTitle')}
          </h3>
          <button 
            onClick={() => setIsOpen(false)} 
            disabled={isGenerating}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors disabled:opacity-50"
          >
            <Icons.X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div>
            <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
              {t('textToVoice')}
            </label>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] text-slate-700 max-h-24 overflow-y-auto custom-scrollbar font-medium">
              {text}
            </div>
          </div>

          <div>
            <label className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
              {t('chooseVoice')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {isVoicesLoading ? (
                <div className="col-span-2 text-center text-slate-400 py-4 text-sm font-bold">
                  {t('loadingVoices')}
                </div>
              ) : (
                voices?.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    disabled={isGenerating}
                    className={`p-3 rounded-xl text-[13px] font-bold transition-all border text-left truncate ${
                      selectedVoice === v.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {v.label}
                  </button>
                ))
              )}
            </div>
          </div>

          <Button 
            variant="primary" 
            onClick={handleGenerate} 
            isLoading={isGenerating} 
            disabled={!selectedVoice || isVoicesLoading}
            className="h-12 w-full text-[15px] rounded-2xl bg-gradient-to-r from-[#20D5EC] to-[#00f2ea] text-slate-900 border-0 hover:opacity-90 disabled:opacity-50"
          >
            {t('generateAudio')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TtsGenerator;