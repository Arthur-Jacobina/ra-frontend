import { tv, type VariantProps } from 'tailwind-variants';

export const panelHeaderStyle = tv({
  base: 'py-xs px-xl border-b-2 border-neutral-soft flex items-center bg-background-soft',
  variants: {
    variant: {
      default: '',
      compact: 'py-xxs px-md',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type PanelHeaderStyleVariants = VariantProps<typeof panelHeaderStyle>;

