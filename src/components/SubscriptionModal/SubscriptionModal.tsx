import React, { useState } from 'react';
import { Icons, Button, Input, Modal } from '@/components/ui';
import { TranslationSchema } from '@/utils/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (code: string) => Promise<{success: boolean, error?: string}>;
  onBuy: () => void;
  isValidating: boolean;
  isPro: boolean;
  timeLeft?: string;
  t: TranslationSchema;
}

const SubscriptionModal = ({ isOpen, onClose, onActivate, onBuy, isValidating, isPro, timeLeft, t }: Props) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleActivate = async () => {
    setError('');
    if (!code.trim()) return setError(t.enterCode || 'Будь ласка, введіть код');
    const result = await onActivate(code.trim().toUpperCase());
    if (result.success) setCode('');
    else setError(result.error || 'Невірний або використаний код');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-8 text-center border border-slate-100 shadow-xl shadow-slate-200/40 relative">
      <button onClick={onClose} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full transition-colors">
        <Icons.X size={20} />
      </button>

      {isPro ? (
        // === СТАН АКТИВНОЇ ПІДПИСКИ ===
        <>
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Icons.Crown size={36} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black mb-2 text-slate-900">{t.proActiveTitle || 'PRO Активовано'}</h2>
          <p className="text-slate-600 mb-8 text-[15px]">
            {t.proValidUntil || 'Підписка дійсна ще:'} <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-md ml-1">{timeLeft}</span>
          </p>

          <div className="space-y-6">
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">{t.extendPro || 'Продовжити підписку'}</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <Button variant="tiktok" className="w-full h-12 text-[15px]" onClick={onBuy}>
              {t.extendProBtn || 'Придбати новий код'}
            </Button>

            <div className="flex flex-col gap-4">
              <Input 
                placeholder="PRO-X7Y8Z9" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={error}
                className="text-center font-mono font-bold tracking-wider text-base uppercase bg-slate-50/50"
              />
              <Button variant="primary" className="w-full h-12 text-[15px]" isLoading={isValidating} onClick={handleActivate}>
                {t.activateCode || 'Активувати код'}
              </Button>
            </div>
          </div>
        </>
      ) : (
        // === СТАН ВІДСУТНОЇ ПІДПИСКИ ===
        <>
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Icons.Sparkles size={36} className="text-slate-900" />
          </div>
          
          <h2 className="text-2xl font-black mb-2 text-slate-900">{t.getProModalTitle || 'Отримай PRO'}</h2>
          <p className="text-slate-500 mb-8 text-[15px]">
            {t.getProModalDesc || 'Генеруй AI-коментарі, завантажуй в SVG без втрати якості та використовуй преміум-функції.'}
          </p>
          
          <div className="space-y-6">
            <Button variant="tiktok" className="w-full h-12 text-[15px]" onClick={onBuy}>
              {t.getProModalTitle || 'Придбати доступ'}
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">{t.orEnterCode || 'Або введіть код'}</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <div className="flex flex-col gap-4">
              <Input 
                placeholder="PRO-X7Y8Z9" 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={error}
                className="text-center font-mono font-bold tracking-wider text-base uppercase bg-slate-50/50"
              />
              <Button variant="primary" className="w-full h-12 text-[15px]" isLoading={isValidating} onClick={handleActivate}>
                {t.activateCode || 'Активувати код'}
              </Button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default SubscriptionModal;