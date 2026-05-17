import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const chipVariants = cva(
  cn(
    "inline-flex items-center gap-1.5 rounded bg-surface-elevated text-muted-foreground",
    "ring ring-border",
    "[&>svg]:shrink-0",
    "[&:is(button,a)]:cursor-pointer",
    "[&:is(button,a)]:transition-colors",
    "[&:is(button,a):hover]:bg-accent",
    "[&:is(button,a):hover]:text-foreground",
    "[&:is(a)]:no-underline [&:is(a)]:text-muted-foreground",
    "[&:is(button,a):focus-visible]:outline-none",
    "[&:is(button,a):focus-visible]:ring-2",
    "[&:is(button,a):focus-visible]:ring-primary",
  ),
  {
    variants: {
      size: {
        default: "px-1.5 py-0.5 text-sm [&>svg]:size-4",
        sm: "px-1.5 py-0.5 text-xs [&>svg]:size-3",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type ChipProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof chipVariants>;

export function Chip({
  size = "default",
  className,
  render,
  ...props
}: ChipProps) {
  return useRender({
    render,
    defaultTagName: "span",
    props: {
      ...props,
      "data-slot": "chip",
      "data-size": size,
      className: cn(chipVariants({ size, className })),
    },
  });
}
