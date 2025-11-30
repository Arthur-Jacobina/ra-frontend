import type React from 'react';
import { 
  toggleContainerStyle, 
  toggleInputStyle, 
  toggleSliderStyle,
  toggleThumbStyle,
  type ToggleStyleVariants 
} from './toggle.component.style';

export interface ToggleProps extends ToggleStyleVariants {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked = false,
  disabled = false,
  onChange,
  size = 'md',
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className={toggleContainerStyle({ size, class: className })}>
      <input
        type="checkbox"
        className={toggleInputStyle}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className={toggleSliderStyle({ checked, disabled })}>
        <span className={toggleThumbStyle({ size, checked })} />
      </span>
    </label>
  );
};

Toggle.displayName = 'Toggle';

