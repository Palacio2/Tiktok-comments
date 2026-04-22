import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';
import { STORAGE_KEYS } from '@/constants';

interface AiParams {
  topic: string;
  mood: string;
  length: string;
  language: string;
}

export const useAiGenerator = (isPro: boolean) => {
  const mutation = useMutation({
    mutationFn: async ({ topic, mood, length, language }: AiParams) => {
      if (!isPro) return null;
      
      const proCode = localStorage.getItem(STORAGE_KEYS.PRO_TOKEN);
      const { data, error } = await supabase.functions.invoke('generate-comment', {
        body: { type: 'comment', topic, mood, length, language, proCode }
      });
      
      if (error) throw new Error(error.message || 'Помилка сервера Supabase');
      if (data?.error) throw new Error(data.error);

      return data.result as string;
    },
    onError: (err: any) => {
      console.error(err);
      alert("ШІ каже: " + err.message);
    }
  });

  return { 
    generateComment: mutation.mutateAsync, 
    isLoading: mutation.isPending 
  };
};