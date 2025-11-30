import { tv } from 'tailwind-variants';

export const formStyle = tv({
  base: 'items-left justify-left flex w-full flex-col gap-md',
});

export const formFieldStyle = tv({
  base: 'flex flex-col gap-xs',
});

export const formLabelStyle = tv({
  base: 'font-light text-[#B6B6B6] text-sm',
});

export const formInputStyle = tv({
  base: 'w-full min-w-0 rounded-md border border-gray-300 px-md py-sm text-base focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary',
});

export const formErrorStyle = tv({
  base: 'rounded-md bg-feedback-danger/10 border border-feedback-danger px-md py-sm text-feedback-danger text-sm',
});
