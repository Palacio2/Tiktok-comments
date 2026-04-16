import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';

export const useAvatarGenerator = (
  onApply: (image: string) => void,
  onClose: () => void
) => {
  const [promptText, setPromptText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const proCode = localStorage.getItem('tiktok_gen_pro_key');
      const { data, error } = await supabase.functions.invoke('proxy-image-TT-comments', {
        body: { prompt, proCode }
      });

      if (error) throw error;
      if (!data?.result) throw new Error('Порожня відповідь сервера');

      return data.result as string;
    },
    onSuccess: (result) => {
      setPreviewImage(result);
    },
    onError: (err, prompt) => {
      console.error('Помилка генерації аватара:', err);
      // Fallback на безкоштовний аватар, якщо Edge Function впала
      const safePrompt = encodeURIComponent(prompt || 'avatar');
      setPreviewImage(`https://api.dicebear.com/9.x/avataaars/svg?seed=${safePrompt}&backgroundColor=b6e3f4,c0aede,d1d4f9`);
    }
  });

  const status = mutation.isPending ? '✨ Зв\'язок з ШІ...' : (mutation.isSuccess ? 'Готово!' : '');

  const handleGenerate = () => {
    if (!promptText.trim()) return;
    mutation.mutate(promptText);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPreviewImage(null);
      setPromptText('');
      mutation.reset(); // Скидаємо стан React Query
    }, 300);
  };

  return {
    promptText,
    setPromptText,
    previewImage,
    isLoading: mutation.isPending,
    status,
    handleGenerate,
    handleClose
  };
};