import { tv, type VariantProps } from 'tailwind-variants';

export const toggleContainerStyle = tv({
  base: 'relative inline-block',
  variants: {
    size: {
      sm: 'w-[36px] h-[20px]',
      md: 'w-[44px] h-[24px]',
      lg: 'w-[52px] h-[28px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const toggleInputStyle = 'opacity-0 w-0 h-0 peer';

export const toggleSliderStyle = tv({
  base: 'absolute cursor-pointer inset-0 rounded-md transition-all duration-300 ease-in-out',
  variants: {
    checked: {
      true: 'bg-primary-soft',
      false: 'bg-neutral-soft',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
      false: '',
    },
  },
  defaultVariants: {
    checked: false,
    disabled: false,
  },
});

export const toggleThumbStyle = tv({
  base: 'absolute top-[2px] left-[2px] bg-white rounded-sm transition-transform duration-300 ease-in-out shadow-md z-10',
  variants: {
    size: {
      sm: 'w-[16px] h-[16px]',
      md: 'w-[20px] h-[20px]',
      lg: 'w-[24px] h-[24px]',
    },
    checked: {
      true: 'bg-neutral-soft',
      false: 'bg-neutral-soft',
    },
  },
  compoundVariants: [
    {
      size: 'sm',
      checked: true,
      class: 'translate-x-[16px]',
    },
    {
      size: 'md',
      checked: true,
      class: 'translate-x-[20px]',
    },
    {
      size: 'lg',
      checked: true,
      class: 'translate-x-[24px]',
    },
  ],
  defaultVariants: {
    size: 'md',
    checked: false,
  },
});

export type ToggleStyleVariants = VariantProps<typeof toggleContainerStyle>;

