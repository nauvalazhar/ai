import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const suggestionVariants = cva(
  cn(
    "group/suggestion inline-flex items-center gap-2 text-sm text-left select-none cursor-pointer",
    "transition-colors",
    "[&>svg]:shrink-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-surface-elevated ring ring-border px-3 py-1.5 text-foreground",
          "hover:bg-accent",
          "[&>svg]:size-4 rounded-full",
        ),
        plain: "hover:bg-accent px-3 py-1.5 [&>svg]:size-4 rounded-full",
        list: cn(
          "rounded px-3 py-1.5 text-muted-foreground bg-transparent",
          "hover:bg-accent",
          "[&>svg]:size-4",
        ),
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type SuggestionProps = Omit<useRender.ComponentProps<"button">, "children"> &
  VariantProps<typeof suggestionVariants> & {
    highlight?: React.ReactNode;
    children?: React.ReactNode;
  };

export function Suggestion({
  variant = "default",
  highlight,
  children,
  className,
  render,
  ...props
}: SuggestionProps) {
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      type: "button",
      ...props,
      "data-slot": "suggestion",
      "data-variant": variant,
      className: cn(suggestionVariants({ variant, className })),
      children,
    },
  });
}
