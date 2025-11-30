import { tv, type VariantProps } from 'tailwind-variants';

export const sidebarContainerStyle = tv({
  base: 'border-r-2 border-neutral-soft flex flex-col items-center gap-md bg-background-soft',
  variants: {
    width: {
      xs: 'w-[60px]',
      sm: 'w-[80px]',
      md: 'w-[100px]',
      lg: 'w-[120px]',
    },
  },
  defaultVariants: {
    width: 'sm',
  },
});

export const sidebarItemStyle = tv({
  base: 'w-full py-md flex bg-neutral/10 items-center justify-center hover:bg-neutral/5 transition-colors',
  variants: {
    active: {
      true: 'bg-neutral/20',
      false: '',
    },
  },
  defaultVariants: {
    active: false,
  },
});

export type SidebarStyleVariants = VariantProps<typeof sidebarContainerStyle>;
export type SidebarItemStyleVariants = VariantProps<typeof sidebarItemStyle>;

