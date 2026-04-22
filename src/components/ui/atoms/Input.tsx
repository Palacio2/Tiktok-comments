import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  id, 
  ...props 
}) => {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 h-14 sm:h-12 rounded-2xl border border-slate-100 bg-white text-slate-800 text-[15px] sm:text-[14px] font-medium transition-all duration-300 ease-out outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-50 placeholder:text-slate-300 shadow-sm ${error ? 'border-red-400 bg-red-50 focus:ring-red-50' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-bold text-red-500 ml-1">{error}</span>}
    </div>
  );
};