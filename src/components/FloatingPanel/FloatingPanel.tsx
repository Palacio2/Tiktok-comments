import React, { useRef } from 'react';
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

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed z-[100] w-[380px] bg-white/95 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] border border-white flex flex-col max-h-[85vh] overflow-hidden ${isDragging ? 'opacity-80 transition-none scale-[0.98]' : 'transition-all duration-300'}`}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
    >
      <div 
        ref={handleRef}
        className="px-6 py-5 border-b border-slate-100/50 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2 text-slate-800 font-bold text-[15px] tracking-wide">
          <Icons.Sparkles size={18} className="text-slate-400" />
          {title}
        </div>
        <button 
          onMouseDown={(e) => e.stopPropagation()} 
          onClick={onClose} 
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-full transition-all"
        >
          <Icons.X size={16} />
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar pb-8">
        {children}
      </div>
    </div>
  );
};

export default FloatingPanel;