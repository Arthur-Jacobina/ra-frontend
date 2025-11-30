import { tv } from "tailwind-variants";

export const messageBubbleStyle = tv({
  base: ' rounded-sm px-md py-sm',
  variants: {
    variant: {
      user: 'border-1 max-w-[28vw] border-neutral-soft',
      agent: 'w-full py-sm',
      cta: 'bg-primary text-neutral-xxsoft mx-2xl hover:bg-primary/90',
    },
  },
  defaultVariants: {
    variant: 'user',
  },
})

