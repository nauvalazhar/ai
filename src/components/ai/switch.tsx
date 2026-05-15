"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const switchVariants = cva(
  [
    "rounded-full flex items-center px-0.5 cursor-pointer shrink-0",
    "ring ring-border bg-muted",
    "data-checked:bg-primary data-checked:ring-primary",
    "transition-colors duration-100",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "data-disabled:cursor-not-allowed data-disabled:opacity-70",
  ],
  {
    variants: {
      size: {
        default:
          "w-9 h-5 [&>[data-slot=switch-thumb]]:size-4 [&>[data-slot=switch-thumb]]:data-checked:translate-x-4",
        sm: "w-7 h-4 [&>[data-slot=switch-thumb]]:size-3 [&>[data-slot=switch-thumb]]:data-checked:translate-x-3",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export function Switch({
  size,
  className,
  ...props
}: React.ComponentProps<typeof BaseSwitch.Root> &
  VariantProps<typeof switchVariants>) {
  return (
    <BaseSwitch.Root
      data-slot="switch"
      className={cn(switchVariants({ size, className }))}
      {...props}
    >
      <BaseSwitch.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white shadow rounded-full",
          "transition-transform duration-100",
        )}
      />
    </BaseSwitch.Root>
  );
}
