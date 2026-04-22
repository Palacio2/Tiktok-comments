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
    <FormSection title={t.authorSettings || "Профіль"} icon={<Icons.Verified size={18} className="text-slate-400" />}>
      <div className="flex gap-6 items-center">
        <div className="shrink-0">
          <div 
            onClick={handlePick}
            className="relative w-20 h-20 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-[#FE2C55] transition-all overflow-hidden group"
          >
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
              <Icons.Upload size={24} className="text-slate-300 group-hover:text-[#FE2C55]" />
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          <Toggle 
            label={<span className="flex items-center gap-2 text-[12px] font-bold text-slate-700"><Icons.Verified size={14} className="text-[#20D5EC]" /> {t.verified}</span>}
            checked={formData.isVerified || false} 
            onChange={(c) => onChange('isVerified', c)} 
          />
          <Toggle 
            label={<span className="flex items-center gap-2 text-[12px] font-bold text-slate-700"><Icons.Info size={14} className="text-[#00a896]" /> {t.authorBadge || 'Автор'}</span>}
            checked={formData.isAuthor || false} 
            onChange={(c) => onChange('isAuthor', c)} 
          />
          <Toggle 
            label={<span className="flex items-center gap-2 text-[12px] font-bold text-slate-700"><Icons.Heart size={14} className="text-[#FE2C55]" /> {t.likedByCreator}</span>}
            checked={formData.isLikedByCreator || false} 
            onChange={(c) => onChange('isLikedByCreator', c)} 
          />
        </div>
      </div>
    </FormSection>
  );
};

export default BadgesSection;