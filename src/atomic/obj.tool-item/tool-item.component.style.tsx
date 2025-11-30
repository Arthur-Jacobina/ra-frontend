import { tv, type VariantProps } from 'tailwind-variants';

export const toolItemStyle = tv({
  base: 'flex items-center justify-between py-xs',
  variants: {
    variant: {
      default: '',
      compact: 'py-xxs',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const toolNameStyle = 'text-sm font-mono';

export type ToolItemStyleVariants = VariantProps<typeof toolItemStyle>;

