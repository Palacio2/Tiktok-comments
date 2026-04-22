import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';
import { STORAGE_KEYS } from '@/constants';
import { useLanguage } from './useLanguage';

export const useTtsVoices = () => {
  return useQuery({
    queryKey: ['tts-voices'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-tts-voices');
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      return data.voices as { id: string; label: string }[];
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export const useTtsGenerator = (isPro: boolean) => {
  const { t } = useLanguage();

  const mutation = useMutation({
    mutationFn: async ({ text, voice }: { text: string; voice: string }) => {
      if (!isPro) throw new Error(t('proRequired'));
      const proCode = localStorage.getItem(STORAGE_KEYS.PRO_TOKEN);
      const { data, error } = await supabase.functions.invoke('generate-tts', {
        body: { text, voice, proCode }
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      if (!data?.audio) throw new Error(t('audioFetchError'));
      return `data:audio/mpeg;base64,${data.audio}`;
    }
  });

  return { 
    generateTts: mutation.mutateAsync, 
    isLoading: mutation.isPending 
  };
};