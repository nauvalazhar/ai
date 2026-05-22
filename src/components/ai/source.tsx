import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const sourceVariants = cva(
  cn(
    "flex flex-col gap-1.5 p-3 rounded-outer",
    "no-underline text-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    "transition-colors hover:bg-accent",
    "[&_[data-slot=source-thumbnail]]:w-full",
    "[&_[data-slot=source-thumbnail]]:aspect-video",
    "[&_[data-slot=source-thumbnail]]:rounded",
    "[&_[data-slot=source-thumbnail]]:object-cover",
    "[&_[data-slot=source-thumbnail]]:mb-2",
  ),
  {
    variants: {
      variant: {
        default: "bg-surface ring ring-border",
        plain: "bg-transparent",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type SourceProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof sourceVariants>;

export function Source({ variant, className, render, ...props }: SourceProps) {
  return useRender({
    render,
    defaultTagName: "div",
    props: {
      ...props,
      "data-slot": "source",
      "data-variant": variant ?? "default",
      className: cn(sourceVariants({ variant, className })),
    },
  });
}

export function SourceName({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="source-name"
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        "[&>img]:size-4 [&>img]:rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export function SourceTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="source-title"
      className={cn(
        "text-sm font-medium text-foreground leading-snug",
        className,
      )}
      {...props}
    />
  );
}

export function SourceDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="source-description"
      className={cn("text-xs text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
}
