import type React from 'react';
import { ActivityIndicator } from '../atm.activity-indicator/activity-indicator.component';

import { type StyleVariants, style } from './button.component.style.tsx';

export interface ButtonProps extends StyleVariants {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ref?: React.RefObject<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  onClick,
  disabled,
  loading,
  type,
  ref,
  ...rest
}) => {
  return (
    <button
      ref={ref}
      className={style({ ...rest, class: className })}
      onClick={onClick}
      disabled={disabled || loading}
      type={type ?? 'button'}>
      {loading ? <ActivityIndicator type={'spinner'} /> : children}
    </button>
  );
};

Button.displayName = 'Button';
