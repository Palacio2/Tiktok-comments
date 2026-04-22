import React from 'react';
import { Icons } from '../icons/Icons';

interface ProTimerProps {
  timeLeft: string;
  isExpired?: boolean;
}

export const ProTimer: React.FC<ProTimerProps> = ({ timeLeft, isExpired }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-100/80 shadow-sm transition-all">
    <span className={`text-[12px] font-extrabold tabular-nums tracking-wider ${isExpired ? 'text-red-500' : 'text-amber-600'}`}>
      {timeLeft}
    </span>
    <Icons.Clock className={isExpired ? 'text-red-400' : 'text-amber-500'} size={14} />
  </div>
);