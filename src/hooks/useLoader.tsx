import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

interface LoaderContextType {
  showLoader: (text?: string) => void;
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextType | null>(null);

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderText, setLoaderText] = useState('');

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
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95">
            <span className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></span>
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