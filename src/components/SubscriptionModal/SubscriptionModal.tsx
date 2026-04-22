import { useState } from 'react';
import { Icons, Button, Input, Modal } from '@/components/ui';
import { useLanguage, usePro } from '@/hooks';
import { toast } from 'sonner';
import PolicyModal from './PolicyModal';

const SubscriptionModal = () => {
  const { t } = useLanguage();
  const { isPro, timeLeft, showProModal, closePro, onActivate, handleBuyPro, isValidating } = usePro();
  
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'refund' | null>(null);

  const handleActivate = async () => {
    setError('');
    const inputCode = code.trim().toUpperCase();
    
    if (!inputCode) {
      const msg = t('enterCode');
      setError(msg);
      toast.error(msg);
      return;
    }
    
    const result = await onActivate(inputCode);
    
    if (result.success) {
      setCode('');
      toast.success(t('proSuccessToast'));
      closePro();
    } else {
      const errMsg = result.error || t('invalidCode');
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <>
      <Modal isOpen={showProModal} onClose={closePro} className="p-5 sm:p-8 text-center border border-slate-100 shadow-2xl relative overflow-hidden max-sm:!rounded-b-none max-sm:!rounded-t-[32px] max-sm:!mt-auto">
        <button onClick={closePro} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-all bg-white shadow-sm border border-slate-100 z-10">
          <Icons.X size={18} />
        </button>

        <div className="max-sm:max-h-[80vh] overflow-y-auto custom-scrollbar max-sm:pb-6">
          {isPro ? (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-sm shrink-0 mt-2">
                <Icons.Crown size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black mb-2 text-slate-900">{t('proActiveTitle')}</h2>
              <p className="text-slate-600 mb-6 sm:mb-8 text-[14px] sm:text-[15px]">
                {t('proValidUntil')} <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-md ml-1">{timeLeft}</span>
              </p>
              
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <Button variant="tiktok" className="w-full h-14 sm:h-12 text-[15px] rounded-2xl" onClick={handleBuyPro}>
                    {t('extendProBtn')}
                  </Button>
                  <p className="text-[11px] text-slate-400 text-center mt-3 px-2 leading-relaxed">
                    {t('termsAgreement')} <button onClick={() => setActivePolicy('terms')} className="underline hover:text-slate-600">{t('termsOfService')}</button>, <button onClick={() => setActivePolicy('privacy')} className="underline hover:text-slate-600">{t('privacyPolicy')}</button> {t('and')} <button onClick={() => setActivePolicy('refund')} className="underline hover:text-slate-600">{t('refundPolicy')}</button>.
                  </p>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
                  <p className="text-[11px] sm:text-[12px] font-bold text-slate-400 uppercase tracking-widest">{t('haveAnotherCode')}</p>
                  <Input 
                    placeholder="PRO-X7Y8Z9" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    error={error}
                    className="text-center font-mono font-bold tracking-wider text-base uppercase bg-slate-50 h-14 sm:h-12 rounded-2xl"
                  />
                  <Button variant="primary" className="w-full h-14 sm:h-12 text-[15px] rounded-2xl" isLoading={isValidating} onClick={handleActivate}>
                    {t('activateCode')}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-sm shrink-0 mt-2">
                <Icons.Sparkles size={32} className="text-slate-900" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black mb-5 sm:mb-6 text-slate-900">{t('getProModalTitle')}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 text-left">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="font-bold text-slate-500 mb-3 text-[13px] sm:text-sm uppercase tracking-wider">{t('freeTier')}</h4>
                  <ul className="space-y-2.5 text-[13px] sm:text-sm text-slate-600 font-medium">
                    <li className="flex items-center gap-2"><Icons.X size={16} className="text-slate-300"/> {t('featurePng')}</li>
                    <li className="flex items-center gap-2"><Icons.X size={16} className="text-slate-300"/> {t('featureWatermark')}</li>
                    <li className="flex items-center gap-2"><Icons.X size={16} className="text-slate-300"/> {t('featureBasicAi')}</li>
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 shadow-sm">
                  <h4 className="font-bold text-amber-600 mb-3 text-[13px] sm:text-sm flex items-center gap-1.5 uppercase tracking-wider"><Icons.Crown size={16}/> {t('proTier')}</h4>
                  <ul className="space-y-2.5 text-[13px] sm:text-sm text-amber-900 font-bold">
                    <li className="flex items-center gap-2"><Icons.Verified size={16} className="text-emerald-500"/> {t('featureSvg')}</li>
                    <li className="flex items-center gap-2"><Icons.Verified size={16} className="text-emerald-500"/> {t('featureNoWatermark')}</li>
                    <li className="flex items-center gap-2"><Icons.Verified size={16} className="text-emerald-500"/> {t('featureAiVoice')}</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div>
                  <Button variant="tiktok" className="w-full h-14 sm:h-12 text-[15px] rounded-2xl shadow-sm" onClick={handleBuyPro}>
                    {t('buyCodeBtn')}
                  </Button>
                  <p className="text-[11px] text-slate-400 text-center mt-3 px-2 leading-relaxed">
                    {t('termsAgreement')} <button onClick={() => setActivePolicy('terms')} className="underline hover:text-slate-600">{t('termsOfService')}</button>, <button onClick={() => setActivePolicy('privacy')} className="underline hover:text-slate-600">{t('privacyPolicy')}</button> {t('and')} <button onClick={() => setActivePolicy('refund')} className="underline hover:text-slate-600">{t('refundPolicy')}</button>.
                  </p>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
                  <Input 
                    placeholder="PRO-X7Y8Z9" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    error={error}
                    className="text-center font-mono font-bold tracking-wider text-base uppercase bg-slate-50 h-14 sm:h-12 rounded-2xl"
                  />
                  <Button variant="primary" className="w-full h-14 sm:h-12 text-[15px] rounded-2xl shadow-sm" isLoading={isValidating} onClick={handleActivate}>
                    {t('activateCodeBtn')}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      <PolicyModal 
        isOpen={!!activePolicy} 
        onClose={() => setActivePolicy(null)} 
        policyType={activePolicy} 
      />
    </>
  );
};

export default SubscriptionModal;