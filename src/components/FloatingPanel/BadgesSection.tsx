import React from 'react';
import { FormSection, Icons, Toggle } from '@/components/ui';
import { useFileUploader, useLanguage } from '@/hooks';

interface BadgesSectionProps {
  formData: {
    avatarUrl?: string | null;
    isVerified?: boolean;
    isAuthor?: boolean;
    isLikedByCreator?: boolean;
  };
  onChange: (field: string, value: unknown) => void;
  onAvatarChange: (url: string | null) => void;
}

const BadgesSection: React.FC<BadgesSectionProps> = ({ formData, onChange, onAvatarChange }) => {
  const { t } = useLanguage();
  const { fileInputRef, handlePick, handleFileChange } = useFileUploader(onAvatarChange);

  return (
    <FormSection title={t('authorSettings')} icon={<Icons.Verified size={18} className="text-slate-400" />}>
      <div className="flex flex-col sm:flex-row gap-5 items-center">
        <div 
          onClick={handlePick}
          className="relative w-24 h-24 sm:w-20 sm:h-20 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-[#FE2C55] transition-all overflow-hidden group shrink-0"
        >
          {formData.avatarUrl ? (
            <img src={formData.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
          ) : (
            <Icons.Upload size={24} className="text-slate-300 group-hover:text-[#FE2C55]" />
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
        
        <div className="w-full flex flex-col gap-2">
          <Toggle 
            label={<div className="flex items-center gap-2 text-[12px] font-bold text-slate-700"><Icons.Verified size={14} className="text-[#20D5EC]" /> {t('verified')}</div>}
            checked={formData.isVerified || false} 
            onChange={(c) => onChange('isVerified', c)} 
          />
          <Toggle 
            label={<div className="flex items-center gap-2 text-[12px] font-bold text-slate-700"><Icons.Info size={14} className="text-[#00a896]" /> {t('authorBadge')}</div>}
            checked={formData.isAuthor || false} 
            onChange={(c) => onChange('isAuthor', c)} 
          />
          <Toggle 
            label={<div className="flex items-center gap-2 text-[12px] font-bold text-slate-700"><Icons.Heart size={14} className="text-[#FE2C55]" /> {t('likedByCreator')}</div>}
            checked={formData.isLikedByCreator || false} 
            onChange={(c) => onChange('isLikedByCreator', c)} 
          />
        </div>
      </div>
    </FormSection>
  );
};

export default BadgesSection;