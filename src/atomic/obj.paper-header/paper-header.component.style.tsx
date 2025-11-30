import { tv } from 'tailwind-variants';

export const paperHeaderStyle = tv({
  base: [
    'pt-sm',
    'px-sm',
    'flex',
    'flex-1',
    'border-b',
    'shadow-sm',
    'items-center',
    'justify-center',
    'border-neutral-soft',
    'z-1000',
  ],
});

export const paperHeaderContentStyle = tv({
  base: [
    'flex',
    'flex-row',
    'items-center',
    'justify-center',
    'gap-x-xl',
  ],
});

