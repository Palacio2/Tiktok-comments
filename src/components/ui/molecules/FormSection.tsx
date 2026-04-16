import React from 'react';

interface FormSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  containerClassName?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, icon, children, containerClassName = '' }) => {
  return (
    <section className="flex flex-col gap-3 w-full">
      <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-2">
        {icon}
        {title}
      </h3>
      <div className={`bg-white p-6 sm:p-7 rounded-[28px] border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.04)] flex flex-col gap-6 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
};