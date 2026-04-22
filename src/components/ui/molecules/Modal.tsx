import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className = '' }) => {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (!isOpen) setIsMounted(false);
  };

  if (!isMounted) return null;

  return createPortal(
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center max-sm:items-end sm:p-4 transition-all duration-300 ease-out ${isVisible ? 'bg-slate-900/40 backdrop-blur-sm opacity-100' : 'bg-transparent backdrop-blur-none opacity-0 pointer-events-none'}`} 
      onClick={onClose}
      onTransitionEnd={handleTransitionEnd}
    >
      <div 
        className={`bg-white w-full max-w-md max-sm:rounded-t-[32px] max-sm:rounded-b-none max-sm:mt-auto sm:rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] transition-all duration-300 ease-out ${isVisible ? 'max-sm:translate-y-0 sm:scale-100 sm:opacity-100' : 'max-sm:translate-y-full sm:scale-95 sm:opacity-0'} ${className}`} 
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};