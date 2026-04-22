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
      <Modal isOpen={showProModal} onClose={closePro} className="p-8 text-center border border-slate-100 shadow-sm relative overflow-hidden">
        <button onClick={closePro} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors z-10">
          <Icons.X size={20} />
        </button>

        {isPro ? (
          <>
            <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Icons.Crown size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black mb-2 text-slate-900">{t('proActiveTitle')}</h2>
            <p className="text-slate-600 mb-8 text-[15px]">
              {t('proValidUntil')} <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-md ml-1">{timeLeft}</span>
            </p>
            
            <div className="space-y-6">
              <div>
                <Button variant="tiktok" className="w-full h-12 text-[15px] rounded-2xl" onClick={handleBuyPro}>
                  {t('extendProBtn')}
                </Button>
                {/* ДОДАНО СЮДИ ТАКОЖ: Текст згоди з політиками для активних користувачів */}
                <p className="text-[11px] text-slate-400 text-center mt-3 px-2 leading-relaxed">
                  {t('termsAgreement')} <button onClick={() => setActivePolicy('terms')} className="underline hover:text-slate-600">{t('termsOfService')}</button>, <button onClick={() => setActivePolicy('privacy')} className="underline hover:text-slate-600">{t('privacyPolicy')}</button> {t('and')} <button onClick={() => setActivePolicy('refund')} className="underline hover:text-slate-600">{t('refundPolicy')}</button>.
                </p>
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 mt-6">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{t('haveAnotherCode')}</p>
                <Input 
                  placeholder="PRO-X7Y8Z9" 
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  error={error}
                  className="text-center font-mono font-bold tracking-wider text-base uppercase bg-slate-50 h-12 rounded-2xl"
                />
                <Button variant="primary" className="w-full h-12 text-[15px] rounded-2xl" isLoading={isValidating} onClick={handleActivate}>
                  {t('activateCode')}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Icons.Sparkles size={36} className="text-slate-900" />
            </div>
            <h2 className="text-2xl font-black mb-6 text-slate-900">{t('getProModalTitle')}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8 text-left">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-500 mb-3 text-sm">{t('freeTier')}</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><Icons.X size={14} className="text-slate-300"/> {t('featurePng')}</li>
                  <li className="flex items-center gap-2"><Icons.X size={14} className="text-slate-300"/> {t('featureWatermark')}</li>
                  <li className="flex items-center gap-2"><Icons.X size={14} className="text-slate-300"/> {t('featureBasicAi')}</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <h4 className="font-bold text-amber-600 mb-3 text-sm flex items-center gap-1"><Icons.Crown size={14}/> {t('proTier')}</h4>
                <ul className="space-y-2 text-sm text-amber-900">
                  <li className="flex items-center gap-2"><Icons.Verified size={14} className="text-emerald-500"/> {t('featureSvg')}</li>
                  <li className="flex items-center gap-2"><Icons.Verified size={14} className="text-emerald-500"/> {t('featureNoWatermark')}</li>
                  <li className="flex items-center gap-2"><Icons.Verified size={14} className="text-emerald-500"/> {t('featureAiVoice')}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Button variant="tiktok" className="w-full h-12 text-[15px] rounded-2xl" onClick={handleBuyPro}>
                  {t('buyCodeBtn')}
                </Button>
                {/* ПОСИЛАННЯ В СТАНІ БЕЗ PRO */}
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
                  className="text-center font-mono font-bold tracking-wider text-base uppercase bg-white h-12 rounded-2xl"
                />
                <Button variant="primary" className="w-full h-12 text-[15px] rounded-2xl" isLoading={isValidating} onClick={handleActivate}>
                  {t('activateCodeBtn')}
                </Button>
              </div>
            </div>
          </>
        )}
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