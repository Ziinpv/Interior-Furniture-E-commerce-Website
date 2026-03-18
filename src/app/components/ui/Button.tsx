import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300',
    outline: 'border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white',
    ghost: 'text-neutral-900 hover:bg-neutral-100',
  };
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
