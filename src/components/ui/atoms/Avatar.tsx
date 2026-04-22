import React from 'react';
import { Icons } from '../icons/Icons';

interface AvatarProps {
  url: string | null;
  size?: 'sm' | 'md';
  isDark?: boolean;
  hasGradient?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const Avatar: React.FC<AvatarProps> = ({ url, size = 'md', isDark = false, hasGradient = false, onClick }) => {
  const sizeClasses = size === 'sm' ? 'w-9 h-9' : 'w-12 h-12 sm:w-14 sm:h-14';
  const iconSize = size === 'sm' ? 18 : 26;

  const innerContent = (
    <div 
      onClick={onClick}
      className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-opacity ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${hasGradient ? 'border-[1.5px]' : 'border-[0.5px]'} ${isDark ? (hasGradient ? 'border-[#121212] bg-slate-800' : 'border-white/10 bg-slate-800') : (hasGradient ? 'border-white bg-slate-100' : 'border-black/5 bg-slate-100')}`}
    >
      {url ? (
        <img src={url} alt="" className="w-full h-full object-cover" />
      ) : (
        <Icons.User size={iconSize} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
      )}
    </div>
  );

  if (hasGradient) {
    return (
      <div className="shrink-0 pt-1">
        <div className={`${sizeClasses} rounded-full p-[2px] bg-gradient-to-tr from-[#00f2ea] to-[#00ff85]`}>
          {innerContent}
        </div>
      </div>
    );
  }

  return (
    <div className="shrink-0 pt-0.5">
      <div className={sizeClasses}>
        {innerContent}
      </div>
    </div>
  );
};