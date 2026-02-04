import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@utils';

export const usePro = () => {
  const [proData, setProData] = useState({
    isPro: false,
    expirationDate: null,
    isLoading: true
  });
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Helper для кодування/декодування дати (простий захист від дурня)
  const encodeData = (dateStr) => btoa(`PRO_LICENSE_${dateStr}_SECRET`);
  const decodeData = (encodedStr) => {
    try {
      const decoded = atob(encodedStr);
      if (!decoded.startsWith('PRO_LICENSE_') || !decoded.endsWith('_SECRET')) return null;
      return decoded.replace('PRO_LICENSE_', '').replace('_SECRET', '');
    } catch {
      return null;
    }
  };

  const checkStatus = useCallback(() => {
    const localData = localStorage.getItem('pro_data_secure');
    
    if (!localData) {
      setProData({ isPro: false, expirationDate: null, isLoading: false });
      return;
    }

    const expiryDateStr = decodeData(localData);
    if (!expiryDateStr) {
      localStorage.removeItem('pro_data_secure');
      setProData({ isPro: false, expirationDate: null, isLoading: false });
      return;
    }

    const isExpired = new Date() > new Date(expiryDateStr);
    
    if (isExpired) {
      localStorage.removeItem('pro_data_secure');
      setProData({ isPro: false, expirationDate: null, isLoading: false });
    } else {
      setProData({ isPro: true, expirationDate: expiryDateStr, isLoading: false });
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const activatePro = useCallback(async (code) => {
    setIsValidating(true);
    try {
      const { data, error } = await supabase.rpc('activate_license', { 
        lookup_code: code.trim().toUpperCase() 
      });

      if (error || !data || !data.success) {
        setIsValidating(false);
        return false;
      }

      const expiry = data.expires_at;
      localStorage.setItem('pro_data_secure', encodeData(expiry));
      
      setProData({ isPro: true, expirationDate: expiry, isLoading: false });
      setIsSubModalOpen(false);
      setIsValidating(false);
      return true;
      
    } catch (err) {
      console.error(err);
      setIsValidating(false);
      return false;
    }
  }, []);

  const handleBuyPro = useCallback(() => {
    window.open(import.meta.env.VITE_STRIPE_URL || '#', '_blank');
  }, []);

  return { 
    isPro: proData.isPro, 
    expirationDate: proData.expirationDate, 
    isSubModalOpen, 
    setIsSubModalOpen, 
    handleBuyPro, 
    activatePro, 
    isValidating 
  };
};