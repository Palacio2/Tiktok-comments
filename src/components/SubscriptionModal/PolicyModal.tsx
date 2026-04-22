import React from 'react';
import { Modal, Icons } from '@/components/ui';
import { useLanguage } from '@/hooks';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyType: 'terms' | 'privacy' | 'refund' | 'gdpr' | 'faq' | 'disclaimer' | null;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, policyType }) => {
  const { t } = useLanguage();

  const getPolicyContent = () => {
    switch (policyType) {
      case 'terms': return { title: t('termsOfService'), content: t('termsPolicyText') };
      case 'privacy': return { title: t('privacyPolicy'), content: t('privacyPolicyText') };
      case 'refund': return { title: t('refundPolicy'), content: t('refundPolicyText') };
      case 'gdpr': return { title: t('gdprTitle'), content: t('gdprPolicyText') };
      case 'faq': return { title: t('faqTitle'), content: t('faqText') };
      case 'disclaimer': return { title: t('disclaimerTitle'), content: t('disclaimerText') };
      default: return { title: '', content: '' };
    }
  };

  const { title, content } = getPolicyContent();

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return <h4 key={index} className="font-bold text-slate-900 text-[15px] mt-5 mb-2">{line.replace('## ', '')}</h4>;
      }
      if (line.startsWith('• ')) {
        return <li key={index} className="ml-4 list-disc text-slate-600 mb-1">{line.replace('• ', '')}</li>;
      }
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      return <p key={index} className="text-slate-600 mb-1">{line}</p>;
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 border border-slate-100 shadow-2xl relative z-[10000] sm:max-w-[600px] max-sm:!rounded-b-none max-sm:!rounded-t-[32px] max-sm:!mt-auto">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
        <h3 className="text-[17px] sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          {policyType === 'faq' || policyType === 'disclaimer' ? (
            <Icons.Sparkles className="text-amber-500" size={20} />
          ) : (
            <Icons.Info className="text-[#20D5EC]" size={20} />
          )}
          {title}
        </h3>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-900 rounded-full transition-all bg-white shadow-sm border border-slate-100">
          <Icons.X size={18} />
        </button>
      </div>
      <div className="p-5 sm:p-6 overflow-y-auto max-h-[70vh] custom-scrollbar bg-white max-sm:pb-12">
        <div className="text-[14px] leading-relaxed font-medium">
          {renderFormattedText(content)}
        </div>
      </div>
    </Modal>
  );
};

export default PolicyModal;