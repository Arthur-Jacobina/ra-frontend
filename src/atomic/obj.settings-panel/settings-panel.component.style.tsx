import { tv, type VariantProps } from 'tailwind-variants';

export const settingsPanelStyle = tv({
  base: 'flex flex-col gap-lg bg-background-soft',
  variants: {
    width: {
      sm: 'w-[280px]',
      md: 'w-[320px]',
      lg: 'w-[400px]',
    },
  },
  defaultVariants: {
    width: 'md',
  },
});

export const settingsSectionStyle = 'px-xl';

export const settingsSectionTitleStyle = 'text-md font-semibold mb-md';

export const settingsListStyle = 'flex flex-col gap-sm';

export type SettingsPanelStyleVariants = VariantProps<typeof settingsPanelStyle>;

