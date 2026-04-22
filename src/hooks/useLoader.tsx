import React, { createContext, useContext, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LoaderContextType {
  showLoader: (text?: string) => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | null>(null);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderText, setLoaderText] = useState('');

  useEffect(() => {
    showLoader('Завантаження...');
    const timer = setTimeout(() => {
      hideLoader();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const showLoader = (text = '') => {
    setLoaderText(text);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {isLoading && createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all animate-in fade-in">
          <div className="bg-white p-8 rounded-[28px] shadow-sm flex flex-col items-center gap-5 animate-in zoom-in-95 border border-slate-100">
            <span className="w-12 h-12 border-4 border-slate-100 border-t-[#FE2C55] rounded-full animate-spin"></span>
            {loaderText && <p className="text-slate-800 font-bold text-[15px]">{loaderText}</p>}
          </div>
        </div>,
        document.body
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};