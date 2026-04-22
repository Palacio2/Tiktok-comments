import React, { useRef, useState, useEffect } from 'react';
import { Icons } from '@/components/ui';
import { useDraggable } from '@/hooks/useDraggable';

interface FloatingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({ isOpen, onClose, children, title }) => {
  const handleRef = useRef<HTMLDivElement>(null);
  const { position, isDragging } = useDraggable(handleRef);
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

  return (
    <div 
      onTransitionEnd={handleTransitionEnd}
      className={`
        fixed z-[200] bg-white/95 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] border border-white flex flex-col overflow-hidden
        transition-all duration-300 ease-out
        max-sm:!top-auto max-sm:!left-0 max-sm:w-full max-sm:rounded-t-[32px] max-sm:rounded-b-none max-sm:max-h-[80vh]
        sm:w-[380px] sm:rounded-[32px] sm:max-h-[85vh]
        ${isVisible ? 'max-sm:!bottom-0 max-sm:opacity-100 sm:opacity-100 sm:scale-100' : 'max-sm:!-bottom-full max-sm:opacity-0 sm:opacity-0 sm:scale-95 pointer-events-none'}
        ${isDragging && isVisible ? 'sm:opacity-80 transition-none sm:scale-[0.98]' : ''}
      `}
      style={{ top: isVisible ? `${position.y}px` : undefined, left: isVisible ? `${position.x}px` : undefined }}
    >
      <div 
        ref={handleRef}
        className="px-6 py-5 border-b border-slate-100/50 flex items-center justify-between cursor-grab active:cursor-grabbing select-none max-sm:touch-none"
      >
        <div className="flex items-center gap-2 text-slate-800 font-bold text-[15px] tracking-wide">
          <Icons.Sparkles size={18} className="text-slate-400" />
          {title}
        </div>
        <button 
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={onClose} 
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all"
        >
          <Icons.X size={20} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar pb-12 sm:pb-8">
        {children}
      </div>
    </div>
  );
};

export default FloatingPanel;