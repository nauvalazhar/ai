import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

type StatusState =
  | "neutral"
  | "pending"
  | "inflight"
  | "warning"
  | "active"
  | "error";

export const statusVariants = cva(
  cn(
    "inline-flex items-center rounded-full bg-surface-elevated",
    "ring ring-border text-muted-foreground",
    "[&:is(button,a)]:cursor-pointer",
    "[&:is(button,a)]:transition-colors",
    "[&:is(button,a):hover]:bg-accent",
    "[&:is(button,a):focus-visible]:outline-none",
    "[&:is(button,a):focus-visible]:ring-2",
    "[&:is(button,a):focus-visible]:ring-primary",
  ),
  {
    variants: {
      state: {
        neutral: "",
        pending: "",
        inflight: "text-inflight",
        warning: "text-warning",
        active: "text-foreground",
        error: "text-destructive ring-destructive/30",
      },
      size: {
        default: "gap-1.5 px-2.5 py-1 text-sm",
        sm: "gap-1.5 px-1.5 py-0.5 text-xs",
      },
    },
    defaultVariants: { state: "neutral", size: "default" },
  },
);

const statusDotVariants = cva(
  "relative inline-flex shrink-0 rounded-full bg-current",
  {
    variants: {
      state: {
        neutral: "text-muted-foreground/40",
        pending: "text-muted-foreground",
        inflight: "text-inflight",
        warning: "text-warning",
        active: "text-success",
        error: "text-destructive",
      },
      size: {
        default: "size-2",
        sm: "size-1.5",
      },
    },
    defaultVariants: { state: "neutral", size: "default" },
  },
);

type StatusProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof statusVariants> & {
    state: StatusState;
    pulse?: boolean;
  };

export function Status({
  state,
  size = "default",
  pulse = false,
  className,
  render,
  children,
  ...props
}: StatusProps) {
  return useRender({
    render,
    defaultTagName: "span",
    props: {
      ...props,
      "data-slot": "status",
      "data-state": state,
      className: cn(statusVariants({ state, size, className })),
      children: (
        <>
          <span
            data-slot="status-dot"
            aria-hidden
            className={cn(statusDotVariants({ state, size }))}
          >
            {pulse && (
              <span
                aria-hidden
                className="absolute inset-0 inline-flex animate-ping rounded-full bg-current opacity-60"
              />
            )}
          </span>
          {children}
        </>
      ),
    },
  });
}
