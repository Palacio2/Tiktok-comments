import { useState, useEffect } from 'react';
import { Button } from './atoms/Button'; // Переконайся, що шлях до Button правильний
import { useLanguage } from '@/hooks';

export const CookieBanner = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Перевіряємо, чи користувач вже погодився
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Показуємо банер через 1.5 секунди після завантаження сайту (для краси)
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[360px] z-[99999] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-slate-900/95 backdrop-blur-xl text-white p-5 rounded-[24px] shadow-2xl border border-white/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 shrink-0 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
            <span className="text-xl">🍪</span>
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="font-bold text-[14px] mb-1.5 text-white/90 tracking-wide">{t('cookieTitle')}</h4>
            <p className="text-white/60 text-[12px] leading-relaxed mb-4 font-medium">
              {t('cookieDesc')}
            </p>
            <Button 
              variant="primary" 
              onClick={accept} 
              className="w-full h-10 text-[13px] rounded-xl bg-white text-slate-900 border-0 hover:bg-slate-100 transition-all shadow-sm"
            >
              {t('cookieAccept')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};