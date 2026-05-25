import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const calloutVariants = cva(
  cn(
    "group/callout flex gap-3 rounded-outer p-3 ring",
    "[&_p]:m-0 [&_p]:text-sm [&_p]:text-muted-foreground",
    "[&_p+p]:mt-2",
    "[&_code]:font-mono [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs",
  ),
  {
    variants: {
      tone: {
        info: "bg-surface ring-border",
        warning: "bg-warning/5 ring-warning/30",
        danger: "bg-destructive/5 ring-destructive/40",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

type CalloutProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof calloutVariants>;

export function Callout({
  tone = "info",
  className,
  render,
  ...props
}: CalloutProps) {
  return useRender({
    render,
    defaultTagName: "div",
    props: {
      ...props,
      "data-slot": "callout",
      "data-tone": tone,
      className: cn(calloutVariants({ tone, className })),
    },
  });
}

export function CalloutIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="callout-icon"
      aria-hidden
      className={cn(
        "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center",
        "text-muted-foreground",
        "group-data-[tone=warning]/callout:text-warning",
        "group-data-[tone=danger]/callout:text-destructive",
        "[&>svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function CalloutContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="callout-content"
      className={cn("min-w-0 flex-1 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
