import { useState, useEffect } from 'react';
import { Button } from './atoms/Button';
import { useLanguage } from '@/hooks';

export const CookieBanner = () => {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsMounted(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false); // Запускаємо анімацію зникнення
  };

  const handleTransitionEnd = () => {
    if (!isVisible) setIsMounted(false); // Повністю видаляємо з DOM після анімації
  };

  if (!isMounted) return null;

  return (
    <div 
      onTransitionEnd={handleTransitionEnd}
      className={`fixed max-md:bottom-[88px] max-md:left-4 max-md:right-4 md:bottom-6 md:right-6 md:w-[360px] z-[99999] transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}
    >
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
              className="w-full h-11 text-[13px] rounded-xl bg-white text-slate-900 border-0 hover:bg-slate-100 transition-all shadow-sm active:scale-95"
            >
              {t('cookieAccept')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};