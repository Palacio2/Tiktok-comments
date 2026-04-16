import React from 'react';
import { Icons } from '../icons/Icons';

interface ProTimerProps {
  timeLeft: string;
  isExpired?: boolean;
}

export const ProTimer: React.FC<ProTimerProps> = ({ timeLeft, isExpired }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/80 rounded-lg border border-amber-100/50 shadow-sm">
    <span className={`text-[11px] font-extrabold tabular-nums tracking-wide ${isExpired ? 'text-red-500' : 'text-amber-600'}`}>
      {timeLeft}
    </span>
    <Icons.Clock className={isExpired ? 'text-red-400' : 'text-amber-400'} size={12} />
  </div>
);