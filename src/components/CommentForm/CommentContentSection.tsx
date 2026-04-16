import React from 'react';
import { Input, Toggle, Icons, FormSection } from '@/components/ui';
import { CommentData } from '@/types';
import { TranslationSchema } from '@/utils/translations';
import AiGenerator from './AiGenerator';

interface CommentContentSectionProps {
  formData: CommentData;
  onChange: (field: keyof CommentData, value: any) => void;
  isPro: boolean;
  onOpenPro: () => void;
  t: TranslationSchema;
}

const CommentContentSection: React.FC<CommentContentSectionProps> = ({ 
  formData, 
  onChange, 
  isPro, 
  onOpenPro, 
  t 
}) => {
  const handleDateChange = (rawDate: string) => {
    if (rawDate.includes('-')) {
      const parts = rawDate.split('-');
      if (parts.length === 3) {
        onChange('timeAgo', `${parts[1]}-${parts[2]}`);
        return;
      }
    }
    onChange('timeAgo', rawDate);
  };

  return (
    <FormSection title={t.commentContent || "Контент"} icon={<Icons.Topic size={18} className="text-slate-400" />}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">
            {t.commentText || "Текст коментаря"}
          </label>
          <div className="relative">
            <textarea
              value={formData.commentText}
              onChange={(e) => onChange('commentText', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-800 text-[14px] outline-none focus:bg-white focus:border-slate-300 focus:ring-1 focus:ring-slate-200 resize-none min-h-[100px] transition-all pb-12 shadow-sm"
            />
            <div className="absolute bottom-3 right-3 no-export">
              <AiGenerator 
                onGenerate={(text) => onChange('commentText', text)} 
                isPro={isPro} 
                onOpenPro={onOpenPro} 
                t={t} 
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">
              {t.timeAgo || "Час"}
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50 text-slate-800 text-[14px] outline-none focus:bg-white focus:border-slate-300 transition-all placeholder:text-slate-400 shadow-sm" 
                value={formData.timeAgo} 
                onChange={(e) => onChange('timeAgo', e.target.value)} 
                placeholder="Напр. 4ч."
              />
              <div className="relative w-12 shrink-0 flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-100 cursor-pointer overflow-hidden transition-all group shadow-sm">
                <Icons.Clock size={18} className="text-slate-500 group-hover:text-slate-800 transition-colors" />
                <input 
                  type="date" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  onChange={(e) => handleDateChange(e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Input 
              label={t.likesCount || "Лайки"} 
              type="text"
              value={formData.likes} 
              onChange={(e) => onChange('likes', e.target.value)} 
              className="py-2.5 text-[14px] bg-slate-50/50 border-slate-100 shadow-sm"
              placeholder="Напр. 12500 або 12.5K"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100/80 mt-1">
          <Toggle 
            label={<span className="flex items-center gap-2 text-[13px] font-semibold text-slate-700"><Icons.Heart size={16} className="text-[#FE2C55]" /> {t.likedByCreator || 'Лайк від автора'}</span>} 
            checked={formData.isLikedByCreator} 
            onChange={(c) => onChange('isLikedByCreator', c)} 
          />
        </div>
      </div>
    </FormSection>
  );
};

export default CommentContentSection;