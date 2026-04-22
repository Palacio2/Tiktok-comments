import React, { useState } from 'react';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/hooks';
import PolicyModal from '../SubscriptionModal/PolicyModal';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'refund' | 'gdpr' | 'faq' | 'disclaimer' | null>(null);

  const currentYear = new Date().getFullYear();
  const supportEmail = "youworkday@gmail.com"; 

  return (
    <>
      {/* Зменшено padding: py-6 на мобільних замість pt-10/pb-88 */}
      <footer className="w-full bg-slate-50 py-6 md:pt-12 md:pb-10 border-t border-slate-200/80 mt-auto relative z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col gap-4 md:gap-10">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex flex-col items-center md:items-start gap-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 md:w-10 md:h-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-200/60 shrink-0">
                  <Icons.MusicNote size={14} className="text-[#FE2C55] md:w-5 md:h-5" />
                </div>
                <span className="text-sm md:text-[17px] font-black tracking-tight text-slate-900">TikTok Gen</span>
              </div>
              {/* Приховано опис на мобільних для економії місця */}
              <p className="hidden md:block text-[10px] text-slate-400 font-medium max-w-[200px] mt-1 leading-relaxed">
                {t('libraryDescShort')}
              </p>
            </div>

            {/* Компактні посилання */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <button onClick={() => setActivePolicy('faq')} className="text-[10px] md:text-[13px] font-bold text-slate-500 hover:text-[#FE2C55] transition-colors">
                {t('faqTitle')}
              </button>
              <button onClick={() => setActivePolicy('terms')} className="text-[10px] md:text-[13px] font-bold text-slate-500 hover:text-[#FE2C55] transition-colors">
                {t('termsOfService')}
              </button>
              <button onClick={() => setActivePolicy('privacy')} className="text-[10px] md:text-[13px] font-bold text-slate-500 hover:text-[#FE2C55] transition-colors">
                {t('privacyPolicy')}
              </button>
              <button onClick={() => setActivePolicy('refund')} className="text-[10px] md:text-[13px] font-bold text-slate-500 hover:text-[#FE2C55] transition-colors">
                {t('refundPolicy')}
              </button>
            </div>

            <a 
                href={`mailto:${supportEmail}`} 
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100 transition-all text-[11px] md:text-[13px] font-bold shadow-sm active:scale-95"
              >
                <Icons.User size={12} className="text-[#20D5EC] md:w-4 md:h-4" />
                {t('support')}
              </a>
          </div>

          {/* Компактний дисклеймер без великих відступів */}
          <div className="py-2 px-3 bg-slate-100/50 rounded-xl border border-slate-200/40 cursor-pointer" onClick={() => setActivePolicy('disclaimer')}>
              <p className="text-[9px] text-slate-400 text-center leading-tight">
                <strong>{t('disclaimerLabel')}:</strong> {t('disclaimerFooter')} <span className="underline ml-1 font-bold">{t('readMore')}</span>
              </p>
          </div>

          <div className="w-full h-px bg-slate-200/40"></div>

          <div className="flex justify-center text-center">
            <span className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                © {currentYear} TikTok Gen
            </span>
          </div>

        </div>
      </footer>

      <PolicyModal 
        isOpen={!!activePolicy} 
        onClose={() => setActivePolicy(null)} 
        policyType={activePolicy} 
      />
    </>
  );
};

export default Footer;