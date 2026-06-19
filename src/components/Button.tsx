import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
}

export default function Button({ children, onClick, type = 'button', variant = 'primary', fullWidth }: ButtonProps) {
  const base = 'px-6 py-3 rounded-xl font-semibold text-base transition-colors cursor-pointer';
  const styles = {
    primary: 'bg-orange-400 text-white hover:bg-orange-500 active:bg-orange-600',
    outline: 'border-2 border-orange-300 text-orange-500 hover:bg-orange-50',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}
