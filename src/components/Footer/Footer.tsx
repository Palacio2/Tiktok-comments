import React, { useState } from 'react';
import { Icons } from '@/components/ui';
import { useLanguage } from '@/hooks';
import PolicyModal from '../SubscriptionModal/PolicyModal';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  // ДОДАНО: 'gdpr' та 'faq' до типів стану
  const [activePolicy, setActivePolicy] = useState<'terms' | 'privacy' | 'refund' | 'gdpr' | 'faq' | null>(null);

  const currentYear = new Date().getFullYear();
  const supportEmail = "support@tt-comments.online"; 

  return (
    <>
      <footer className="w-full py-6 border-t border-slate-200/60 bg-white/50 backdrop-blur-xl relative z-40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3 text-slate-400 group cursor-default">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <Icons.MusicNote size={16} className="text-slate-500 group-hover:text-slate-900 transition-colors" />
            </div>
            <span className="text-[13px] font-bold tracking-tight">© {currentYear} TikTok Gen</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] font-bold text-slate-400 uppercase tracking-widest">
            {/* ДОДАНО: Кнопка FAQ */}
            <button onClick={() => setActivePolicy('faq')} className="hover:text-slate-900 transition-colors text-amber-500">
              {t('faqTitle')}
            </button>
            <button onClick={() => setActivePolicy('terms')} className="hover:text-slate-900 transition-colors">
              {t('termsOfService')}
            </button>
            <button onClick={() => setActivePolicy('privacy')} className="hover:text-slate-900 transition-colors">
              {t('privacyPolicy')}
            </button>
            <button onClick={() => setActivePolicy('refund')} className="hover:text-slate-900 transition-colors">
              {t('refundPolicy')}
            </button>
            {/* ДОДАНО: Кнопка GDPR */}
            <button onClick={() => setActivePolicy('gdpr')} className="hover:text-slate-900 transition-colors">
              {t('gdprTitle')}
            </button>
          </div>

          <div className="flex items-center">
             <a 
               href={`mailto:${supportEmail}`} 
               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-slate-900 transition-all text-[13px] font-bold shadow-sm hover:shadow-md"
             >
               <Icons.User size={14} className="text-[#20D5EC]" />
               {t('support')}
             </a>
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