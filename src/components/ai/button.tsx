import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const buttonVariants = cva(
  cn(
    "relative inline-flex items-center justify-center gap-1.5",
    "h-7.5 rounded text-sm font-medium select-none cursor-pointer",
    "transition-[color,background-color,translate] duration-150",
    "active:translate-y-0.25",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    "data-disabled:cursor-not-allowed data-disabled:opacity-60 data-disabled:active:translate-x-0",
    "[&>svg]:size-4 [&>svg]:shrink-0",
    "[&>svg]:transition-all",
    "[&>[data-slot=button-spinner]]:-mr-[22px]",
    "[&>[data-slot=button-spinner]]:scale-0",
    "[&>[data-slot=button-spinner]]:opacity-0",
  ),
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        ghost: "bg-transparent text-foreground hover:bg-accent",
        outline: "bg-surface text-foreground ring ring-border hover:bg-accent",
      },
      iconOnly: {
        true: "size-7.5 px-0",
        false: "px-3",
      },
      loading: {
        true: cn(
          "cursor-progress opacity-70",
          "[&>svg:not([data-slot=button-spinner])]:scale-0",
          "[&>svg:not([data-slot=button-spinner])]:opacity-0",
          "[&>svg:not([data-slot=button-spinner])]:-mr-[22px]",
          "[&>[data-slot=button-spinner]]:mr-0",
          "[&>[data-slot=button-spinner]]:scale-100",
          "[&>[data-slot=button-spinner]]:opacity-100",
          "[&>[data-slot=button-spinner]]:animate-spin",
        ),
      },
    },
    defaultVariants: { variant: "primary", iconOnly: false, loading: false },
  },
);

type ButtonProps = React.ComponentProps<typeof BaseButton> &
  Omit<VariantProps<typeof buttonVariants>, "loading"> & {
    loading?: boolean;
  };

export function Button({
  variant = "primary",
  iconOnly,
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      data-slot="button"
      disabled={disabled || loading}
      aria-busy={loading}
      data-variant={variant}
      className={cn(buttonVariants({ variant, iconOnly, loading, className }))}
      {...props}
    >
      {loading !== undefined && (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          data-slot="button-spinner"
          strokeWidth={2.5}
          aria-hidden
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}
      {children}
    </BaseButton>
  );
}
