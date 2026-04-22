import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';
import { STORAGE_KEYS } from '@/constants';

// Хук для отримання списку голосів
export const useTtsVoices = () => {
  return useQuery({
    queryKey: ['tts-voices'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-tts-voices');
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      return data.voices as { id: string; label: string }[];
    },
    staleTime: 1000 * 60 * 60 * 24, // Кешуємо на 24 години, щоб не спамити API
  });
};

// Твій існуючий хук для генерації залишається майже без змін
export const useTtsGenerator = (isPro: boolean) => {
  const mutation = useMutation({
    mutationFn: async ({ text, voice }: { text: string; voice: string }) => {
      if (!isPro) throw new Error('Потрібна PRO підписка');
      const proCode = localStorage.getItem(STORAGE_KEYS.PRO_TOKEN);
      const { data, error } = await supabase.functions.invoke('generate-tts', {
        body: { text, voice, proCode }
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      if (!data?.audio) throw new Error('Не вдалося отримати аудіо');
      return `data:audio/mpeg;base64,${data.audio}`;
    }
  });

  return { 
    generateTts: mutation.mutateAsync, 
    isLoading: mutation.isPending 
  };
};