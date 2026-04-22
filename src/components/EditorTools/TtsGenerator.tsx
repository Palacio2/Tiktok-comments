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
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 h-11 sm:h-10 text-[11px] uppercase tracking-wider font-bold transition-all duration-300 rounded-xl bg-[#20D5EC] text-white hover:bg-[#1cbcd1] shadow-sm active:scale-95"
      >
        <Icons.Mic size={14} className="text-white" />
        <span>TTS</span>
      </button>

      <Modal isOpen={isOpen} onClose={() => !isGenerating && setIsOpen(false)} className="border border-slate-100 shadow-2xl max-sm:!rounded-b-none max-sm:!rounded-t-[32px] max-sm:!mt-auto">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-[17px] sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Icons.Mic className="text-[#20D5EC]" size={20} /> {t('ttsModalTitle')}
          </h3>
          <button 
            onClick={() => setIsOpen(false)} 
            disabled={isGenerating}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-all bg-white shadow-sm border border-slate-100 disabled:opacity-50"
          >
            <Icons.X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-5 sm:gap-6 max-sm:pb-8">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">
              {t('textToVoice')}
            </label>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] text-slate-700 max-h-24 overflow-y-auto custom-scrollbar font-medium">
              {text}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 block ml-1">
              {t('chooseVoice')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[35vh] sm:max-h-48 overflow-y-auto custom-scrollbar pr-1">
              {isVoicesLoading ? (
                <div className="col-span-full text-center text-slate-400 py-6 text-sm font-bold bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="w-6 h-6 border-2 border-slate-200 border-t-[#20D5EC] rounded-full animate-spin inline-block mb-2" /><br/>
                  {t('loadingVoices')}
                </div>
              ) : (
                voices?.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(v.id)}
                    disabled={isGenerating}
                    className={`p-3.5 sm:p-3 rounded-xl text-[13px] font-bold transition-all border text-left truncate flex items-center justify-between ${
                      selectedVoice === v.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {v.label}
                    {selectedVoice === v.id && <div className="w-1.5 h-1.5 bg-[#20D5EC] rounded-full shrink-0" />}
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
            className="h-14 sm:h-12 w-full text-[15px] rounded-2xl bg-gradient-to-r from-[#20D5EC] to-[#00f2ea] text-slate-900 border-0 shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 mt-2"
          >
            {t('generateAudio')}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TtsGenerator;