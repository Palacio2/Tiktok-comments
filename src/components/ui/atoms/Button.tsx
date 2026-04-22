import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'tiktok';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "button";
  
  const variants = {
    primary: "button-primary",
    secondary: "button-secondary",
    ghost: "button-ghost",
    tiktok: "button-tiktok"
  };

  const sizes = {
    sm: "button-sm",
    md: "button-md",
    lg: "button-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2.5 shrink-0" />
      )}
      {children}
    </button>
  );
};