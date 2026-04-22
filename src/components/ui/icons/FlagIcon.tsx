import React from 'react';

interface FlagIconProps {
  code: string;
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ code, className = '' }) => (
  <img 
    src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`} 
    alt={code} 
    className={`inline-block rounded-[3px] object-cover shadow-sm border border-slate-900/5 w-[20px] h-[15px] shrink-0 ${className}`}
  />
);