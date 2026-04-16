import React, { useState } from 'react';
import { useFileUploader } from '@/hooks/useFileUploader';
import { Icons } from '@/components/ui';
import AvatarGeneratorModal from './AvatarGeneratorModal';

interface AvatarUploaderProps {
  currentAvatar: string | null;
  onUpload: (img: string | null) => void;
  isPro: boolean;
  onOpenPro: () => void;
  t: any;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentAvatar, onUpload, isPro, onOpenPro, t }) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const { fileInputRef, handlePick, handleFileChange } = useFileUploader(onUpload);

  return (
    <div className="flex flex-col gap-3 items-center w-full">
      <div className="relative w-max">
        <div 
          onClick={handlePick} 
          className="group relative w-[88px] h-[88px] rounded-full border border-slate-100 shadow-sm overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-md"
        >
          {currentAvatar ? (
            <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <Icons.User size={36} className="text-slate-300" />
          )}
          <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icons.Upload className="text-white" size={20} />
          </div>
        </div>
        {currentAvatar && (
          <button 
            onClick={(e) => { e.stopPropagation(); onUpload(null); }} 
            className="absolute -top-1 -right-1 z-10 bg-white border border-slate-100 rounded-full p-1 text-slate-400 hover:text-red-500 shadow-sm transition-colors"
          >
            <Icons.X size={12} />
          </button>
        )}
      </div>

      <button 
        type="button"
        onClick={() => isPro ? setIsAiModalOpen(true) : onOpenPro()}
        className="group relative flex items-center justify-center w-full gap-1.5 px-4 py-2.5 text-[12px] font-bold transition-all duration-300 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100 shadow-sm"
      >
        <Icons.Plus size={14} className="text-slate-500 group-hover:text-slate-800" />
        <span>AI</span>
        {!isPro && <Icons.Lock size={10} className="text-slate-400 ml-1" />}
      </button>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      
      <AvatarGeneratorModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} onApply={onUpload} />
    </div>
  );
};

export default AvatarUploader;