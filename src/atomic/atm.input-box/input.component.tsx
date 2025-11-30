import { style } from './input.style';

interface InputBoxProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  required: boolean;
  className?: string;
}

export const InputBox = ({ id, label, placeholder, value, onChange, type, required, className }: InputBoxProps) => {
  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor={id} className="font-light text-[#B6B6B6] text-sm">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={style({ className })}
      />
    </div>
  );
};
