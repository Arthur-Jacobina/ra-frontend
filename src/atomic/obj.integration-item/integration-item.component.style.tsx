import { tv, type VariantProps } from 'tailwind-variants';

export const integrationItemStyle = tv({
  base: 'flex items-center justify-between py-sm',
  variants: {
    variant: {
      default: '',
      compact: 'py-xs',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const integrationIconStyle = tv({
  base: 'rounded-sm flex items-center justify-center',
  variants: {
    size: {
      sm: 'w-[20px] h-[20px]',
      md: 'w-[24px] h-[24px]',
      lg: 'w-[32px] h-[32px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const integrationLabelStyle = 'flex items-center gap-sm';

export type IntegrationItemStyleVariants = VariantProps<typeof integrationItemStyle>;
export type IntegrationIconStyleVariants = VariantProps<typeof integrationIconStyle>;

