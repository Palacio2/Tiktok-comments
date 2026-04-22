import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/utils/supabaseClient';
import { STORAGE_KEYS } from '@/constants';

interface ProContextType {
  isPro: boolean;
  timeLeft: string;
  generationsLeft: number | null; // ДОДАНО
  showProModal: boolean;
  openPro: () => void;
  closePro: () => void;
  onActivate: (code: string) => Promise<{success: boolean, error?: string}>;
  handleBuyPro: () => void;
  isValidating: boolean;
}

const ProContext = createContext<ProContextType | null>(null);

export const ProProvider = ({ children }: { children: ReactNode }) => {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [generationsLeft, setGenerationsLeft] = useState<number | null>(null); // ДОДАНО
  const [isSubModalOpen, setIsSubModalOpen] = useState<boolean>(false);

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase.functions.invoke('verify-license', {
        body: { code }
      });
      if (error || data?.error) throw new Error(data?.error || 'Error');
      // ДОДАНО: витягуємо generationsLeft з відповіді сервера
      return { expirationDate: data.expirationDate, generationsLeft: data.generationsLeft, code };
    },
    onSuccess: ({ expirationDate, code, generationsLeft }) => { // ДОДАНО generationsLeft
      setIsPro(true);
      setExpirationDate(expirationDate);
      setGenerationsLeft(generationsLeft); // ДОДАНО
      localStorage.setItem(STORAGE_KEYS.PRO_TOKEN, code);
    }
  });

  useEffect(() => {
    const updateTimer = () => {
      if (!expirationDate) return;
      const diff = new Date(expirationDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setIsPro(false);
        setExpirationDate(null);
        setGenerationsLeft(null); // ДОДАНО очищення
        localStorage.removeItem(STORAGE_KEYS.PRO_TOKEN);
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

  useEffect(() => {
    const storedKey = localStorage.getItem(STORAGE_KEYS.PRO_TOKEN);
    if (storedKey) verifyMutation.mutate(storedKey);
  }, []);

  const onActivate = async (code: string) => {
    try {
      await verifyMutation.mutateAsync(code);
      return { success: true };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { success: false, error: err.message };
      }
      return { success: false, error: 'Unknown error occurred' };
    }
  };

  return (
    <ProContext.Provider value={{
      isPro,
      timeLeft,
      generationsLeft, // ДОДАНО
      showProModal: isSubModalOpen,
      openPro: () => setIsSubModalOpen(true),
      closePro: () => setIsSubModalOpen(false),
      onActivate,
      handleBuyPro: () => window.open('https://buy.stripe.com/00wbJ0bcuei0dir9aQ9sk01', '_blank'),
      isValidating: verifyMutation.isPending
    }}>
      {children}
    </ProContext.Provider>
  );
};

export const usePro = () => {
  const context = useContext(ProContext);
  if (!context) {
    throw new Error('usePro must be used within a ProProvider');
  }
  return context;
};