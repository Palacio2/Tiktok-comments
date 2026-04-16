import { useCommentForm } from '@/hooks/useCommentForm';
import { useLanguage } from '@/hooks/useLanguage';
import { Icons, FormSection } from '@/components/ui';
import { CommentData, ExportSettings } from '@/types';

import AuthorSection from './AuthorSection';
import CommentContentSection from './CommentContentSection';
import RepliesManager from './RepliesManager';
import ExportSection from './ExportSection';

interface CommentFormProps {
  onGenerate: (data: CommentData) => void;
  exportSettings: ExportSettings;
  updateExportSettings: (settings: Partial<ExportSettings>) => void;
  isPro: boolean;
  onOpenPro: () => void;
  externalAvatar?: string | null;
}

const CommentForm = ({ 
  onGenerate, 
  exportSettings, 
  updateExportSettings, 
  isPro, 
  onOpenPro,
  externalAvatar 
}: CommentFormProps) => {
  const { t } = useLanguage();
  
  const { 
    formData, 
    handleInputChange, 
    handleAvatarChange, 
    handleRepliesChange
  } = useCommentForm(onGenerate, externalAvatar);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <AuthorSection 
        formData={formData} 
        onChange={handleInputChange} 
        onAvatarChange={handleAvatarChange} 
        isPro={isPro} 
        onOpenPro={onOpenPro} 
        t={t} 
      />

      <CommentContentSection 
        formData={formData} 
        onChange={handleInputChange} 
        isPro={isPro} 
        onOpenPro={onOpenPro} 
        t={t} 
      />

      <FormSection title={t.replies || "Відповіді"} icon={<Icons.Reply size={18} className="text-slate-400" />}>
        <RepliesManager 
          replies={formData.replies} 
          onChange={handleRepliesChange} 
          isPro={isPro} 
          onOpenPro={onOpenPro} 
          t={t} 
        />
      </FormSection>

      <ExportSection 
        settings={exportSettings} 
        onUpdate={updateExportSettings} 
        isPro={isPro} 
        onOpenPro={onOpenPro} 
        t={t} 
      />
    </div>
  );
};

export default CommentForm;