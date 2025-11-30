import { tv, type VariantProps } from 'tailwind-variants';
import { focusStyles } from '../obj.mixin/mixin.component.style';

export const style = tv({
  base: [
    'transition duration-200 border shadow-xs inline-flex items-center justify-center py-xs px-md rounded-lg font-medium text-sm cursor-pointer', // Default
    'focus:outline-none',
    focusStyles,
    '[&:hover:not(:disabled)]:opacity-90', // On hover and not disabled
    '[&:not(button)]:text-center', // Not a button element
    'disabled:opacity-70 disabled:cursor-not-allowed',
    'gap-x-xs', // horizontal spacing
    '[&>svg]:mx-xs', // SVG
  ],
  variants: {
    variant: {
      primary: 'bg-primary border-primary text-fixed-white',
      secondary: 'bg-secondary border-secondary text-fixed-white',
      cta: 'bg-cta border-cta text-fixed-white',
      danger: 'bg-feedback-danger border-feedback-danger text-fixed-white',
      neutral: 'border-neutral-soft text-neutral-strong rounded-[3px]',
    },
    size: {
      xs: 'h-[24px] px-xs text-xs',
      sm: 'h-[32px] px-sm',
      md: 'h-[44px]',
      lg: 'h-[52px]',
    },
    outlined: {
      true: 'bg-fixed-transparent',
    },
    expanded: {
      true: 'w-full',
    },
    link: {
      true: 'bg-fixed-transparent border-0 shadow-none !px-xs',
    },
    disabled: {
      true: 'opacity-70 pointer-events-none', // for link buttons only
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
  compoundVariants: [
    { variant: 'neutral', link: true, class: 'hover:bg-neutral-xsoft' },
    {
      variant: 'primary',
      outlined: true,
      class: 'border-primary text-primary',
    },
    {
      variant: 'secondary',
      outlined: true,
      class: 'border-secondary text-secondary dark:text-fixed-white',
    },
    { variant: 'cta', outlined: true, class: 'border-cta text-cta' },
    { variant: 'danger', outlined: true, class: 'border-feedback-danger text-feedback-danger' },
    {
      variant: 'neutral',
      outlined: true,
      class: 'border-neutral-strong text-neutral-strong',
    },
    { variant: 'primary', link: true, class: 'text-primary' },
    { variant: 'secondary', link: true, class: 'text-secondary' },
    { variant: 'cta', link: true, class: 'text-cta' },
    { variant: 'danger', link: true, class: 'text-feedback-danger' },
    { variant: 'neutral', link: true, class: 'text-neutral-strong' },
  ],
});

export type StyleVariants = VariantProps<typeof style>;
