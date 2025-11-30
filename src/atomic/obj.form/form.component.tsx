import type React from 'react';
import { Button } from '../atm.button/button.component';
import { formErrorStyle, formFieldStyle, formInputStyle, formLabelStyle, formStyle } from './form.style';

// Main Form Component
interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export const Form = ({ children, onSubmit, className }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={formStyle({ className })}>
      {children}
    </form>
  );
};

// Form Field Component
interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  id?: string;
  required?: boolean;
  autoComplete?: string;
  minLength?: number;
  className?: string;
}

export const FormField = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  minLength,
  className,
}: FormFieldProps) => {
  return (
    <div className={formFieldStyle()}>
      <label htmlFor={id} className={formLabelStyle()}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        minLength={minLength}
        className={formInputStyle({ className })}
      />
    </div>
  );
};

// Form Error Component
interface FormErrorProps {
  error: Error | null | undefined;
  defaultMessage?: string;
  className?: string;
}

export const FormError = ({ error, defaultMessage, className }: FormErrorProps) => {
  if (!error) return null;

  return <div className={formErrorStyle({ className })}>{error.message || defaultMessage || 'An error occurred'}</div>;
};

// Form Submit Button Component
interface FormSubmitProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormSubmit = ({ loading, children, className }: FormSubmitProps) => {
  return (
    <Button type="submit" variant="primary" loading={loading} expanded className={className || 'mt-md'}>
      {children}
    </Button>
  );
};
