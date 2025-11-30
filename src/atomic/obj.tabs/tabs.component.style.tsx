import { tv, type VariantProps } from 'tailwind-variants';

export const tabsRootStyle = tv({
  base: 'flex flex-col',
});

export const tabsListStyle = tv({
  base: 'flex flex-row gap-x-xl items-center',
});

export const tabsTriggerStyle = tv({
  base: [
    'text-neutral-strong',
    'cursor-pointer',
    'transition-all duration-200',
    'hover:text-primary',
    'focus:outline-none',
    'font-medium',
    'pb-sm',
    'border-b-2',
    'border-transparent',
  ],
  variants: {
    active: {
      true: 'text-primary border-b-primary',
      false: 'text-neutral-strong border-transparent',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export type TabsTriggerStyleVariants = VariantProps<typeof tabsTriggerStyle>;

