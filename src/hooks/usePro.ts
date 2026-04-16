import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';

export const usePro = () => {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isSubModalOpen, setIsSubModalOpen] = useState<boolean>(false);

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.functions.invoke('verify-license', {
        body: { code }
      });

      if (error || data?.error) {
        throw new Error(data?.error || 'Помилка перевірки коду');
      }
      if (data?.success) {
        return { expirationDate: data.expirationDate, code };
      }
      throw new Error('Невідома помилка');
    },
    onSuccess: ({ expirationDate, code }) => {
      setIsPro(true);
      setExpirationDate(expirationDate);
      localStorage.setItem('tiktok_gen_pro_key', code);
    },
    onError: () => {
      setIsPro(false);
      setExpirationDate(null);
      localStorage.removeItem('tiktok_gen_pro_key');
    }
  });

  // Локальний таймер
  useEffect(() => {
    if (!expirationDate) {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const diff = new Date(expirationDate).getTime() - new Date().getTime();

      if (diff <= 0) {
        setIsPro(false);
        setTimeLeft('');
        localStorage.removeItem('tiktok_gen_pro_key');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) setTimeLeft(`${days}d ${hours}h`);
      else if (hours > 0) setTimeLeft(`${hours}h ${minutes}m`);
      else setTimeLeft(`${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [expirationDate]);

  // Перевірка збереженого коду при старті
  useEffect(() => {
    const storedKey = localStorage.getItem('tiktok_gen_pro_key');
    if (storedKey) {
      verifyMutation.mutate(storedKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activatePro = async (key: string) => {
    try {
      await verifyMutation.mutateAsync(key);
      setIsSubModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const openPro = useCallback(() => setIsSubModalOpen(true), []);
  const closePro = useCallback(() => setIsSubModalOpen(false), []);

  const handleBuyPro = useCallback(() => {
    window.open('https://buy.stripe.com/00wbJ0bcuei0dir9aQ9sk01', '_blank');
  }, []);

  return { 
    isPro, timeLeft, showProModal: isSubModalOpen, 
    isValidating: verifyMutation.isPending, 
    openPro, closePro, activatePro, handleBuyPro 
  };
};