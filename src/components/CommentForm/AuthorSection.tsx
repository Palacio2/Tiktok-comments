import React from 'react';
import { Input, Toggle, Icons, FormSection } from '@/components/ui';
import { CommentData } from '@/types';
import { TranslationSchema } from '@/utils/translations';
import AvatarUploader from './AvatarUploader';

interface AuthorSectionProps {
  formData: CommentData;
  onChange: (field: keyof CommentData, value: any) => void;
  onAvatarChange: (url: string | null) => void;
  isPro: boolean;
  onOpenPro: () => void;
  t: TranslationSchema;
}

const AuthorSection: React.FC<AuthorSectionProps> = ({ 
  formData, 
  onChange, 
  onAvatarChange, 
  isPro, 
  onOpenPro, 
  t 
}) => {
  const handleUsernameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value.trim()) {
      onChange('username', 'tiktok_gen');
    }
  };

  return (
    <FormSection 
      title={t.authorSettings || "Профіль автора"} 
      icon={<Icons.User size={16} className="text-slate-400" />}
    >
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        
        <div className="shrink-0 w-24 flex flex-col items-center gap-3">
          <AvatarUploader 
            currentAvatar={formData.avatarUrl} 
            onUpload={onAvatarChange} 
            isPro={isPro} 
            onOpenPro={onOpenPro} 
            t={t} 
          />
        </div>
        
        <div className="flex-1 flex flex-col gap-5 w-full">
          <Input 
            label={t.username || "Нікнейм"} 
            name="username" 
            value={formData.username} 
            onChange={(e) => onChange('username', e.target.value)} 
            onBlur={handleUsernameBlur}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <Toggle 
              label={<span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700"><Icons.Verified size={14} className="text-[#20D5EC] shrink-0" /> {t.verified || 'Верифікація'}</span>}
              checked={formData.isVerified} 
              onChange={(c) => onChange('isVerified', c)} 
            />
            <Toggle 
              label={<span className="flex items-center gap-1.5 text-[12px] font-bold text-slate-700"><Icons.Heart size={14} className="text-[#ff3b5c] shrink-0" /> {t.authorBadge || 'Мітка Автора'}</span>}
              checked={formData.isAuthor} 
              onChange={(c) => onChange('isAuthor', c)} 
            />
          </div>
        </div>
        
      </div>
    </FormSection>
  );
};

export default AuthorSection;