import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
}

export const Toggle: React.FC<ToggleProps> = ({ 
  checked, 
  onChange, 
  disabled = false, 
  label 
}) => {
  return (
    <label className={`flex items-center justify-between px-4 h-12 bg-white border border-slate-100 shadow-sm rounded-2xl cursor-pointer transition-all active:scale-[0.98] select-none w-full ${disabled ? 'opacity-50' : 'hover:border-slate-200'}`}>
      {label && (
        <div className="flex items-center">
          {label}
        </div>
      )}
      
      <div className="relative inline-flex items-center ml-2 shrink-0">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#FE2C55]"></div>
      </div>
    </label>
  );
};