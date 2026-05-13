import { createContext, use } from "react";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

const AttachmentContext = createContext<{ progress?: number }>({});

export const attachmentVariants = cva(
  cn(
    "relative text-foreground",
    "ring ring-border",
    "[&_[data-slot=attachment-media-img]]:size-full",
    "[&_[data-slot=attachment-media-img]]:object-cover",
    "[&:is(button,a)]:cursor-pointer",
    "[&:is(button,a)]:transition-colors",
    "[&:is(a)]:no-underline [&:is(a)]:text-foreground",
    "[&:is(button,a):focus-visible]:outline-none",
    "[&:is(button,a):focus-visible]:ring-2",
    "[&:is(button,a):focus-visible]:ring-primary",
  ),
  {
    variants: {
      layout: {
        row: cn(
          "inline-flex items-center gap-2.5 rounded-outer p-1.5 pr-2",
          "bg-surface",
          "[&:is(button,a):hover]:bg-accent",
        ),
        card: cn(
          "inline-flex shrink-0 aspect-square size-16 rounded-outer",
          "[&:is(button,a):hover]:ring-2 [&:is(button,a):hover]:ring-border",
        ),
      },
      state: {
        default: "",
        error: "bg-destructive/5 ring-destructive/40",
      },
    },
    defaultVariants: { layout: "row", state: "default" },
  },
);

type AttachmentProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    progress?: number;
  };

export function Attachment({
  layout = "row",
  state = "default",
  progress,
  className,
  render,
  ...props
}: AttachmentProps) {
  const element = useRender({
    render,
    defaultTagName: "div",
    props: {
      ...props,
      "data-slot": "attachment",
      "data-layout": layout,
      "data-state": state,
      className: cn(attachmentVariants({ layout, state, className })),
    },
  });
  return <AttachmentContext value={{ progress }}>{element}</AttachmentContext>;
}

export function AttachmentMedia({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-media"
      className={cn(
        "relative shrink-0 overflow-hidden rounded",
        "inline-flex items-center justify-center",
        "bg-surface-elevated text-muted-foreground",
        "in-data-[layout=row]:size-9",
        "in-data-[layout=card]:size-full",
        "in-data-[layout=card]:rounded-outer",
        "in-data-[state=error]:bg-destructive/10",
        "in-data-[state=error]:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-icon"
      aria-hidden
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        "[&>svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn("flex flex-1 flex-col min-w-0 leading-tight", className)}
      {...props}
    />
  );
}

export function AttachmentName({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-name"
      className={cn("text-sm text-foreground truncate", className)}
      {...props}
    />
  );
}

export function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-description"
      className={cn(
        "text-xs text-muted-foreground truncate",
        "in-data-[state=error]:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function AttachmentOverlay({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-overlay"
      className={cn(
        "absolute inset-0 inline-flex items-center justify-center",
        "rounded bg-foreground/45 text-background backdrop-blur-[1px]",
        className,
      )}
      {...props}
    />
  );
}

const PROGRESS_RADIUS = 10;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS;

export function AttachmentProgress({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  const { progress } = use(AttachmentContext);
  const indeterminate = progress === undefined;
  const clamped = Math.max(0, Math.min(100, progress ?? 0));
  const offset = indeterminate
    ? PROGRESS_CIRCUMFERENCE * 0.75
    : PROGRESS_CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <svg
      data-slot="attachment-progress"
      viewBox="0 0 24 24"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cn(
        "size-6 text-current",
        indeterminate ? "animate-spin" : "-rotate-90",
        className,
      )}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r={PROGRESS_RADIUS}
        fill="none"
        strokeWidth="2"
        className="stroke-current opacity-25"
      />
      <circle
        cx="12"
        cy="12"
        r={PROGRESS_RADIUS}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={PROGRESS_CIRCUMFERENCE}
        strokeDashoffset={offset}
        className="stroke-current transition-[stroke-dashoffset] duration-300"
      />
    </svg>
  );
}

export function AttachmentAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-action"
      className={cn("inline-flex items-center gap-0.5 shrink-0", className)}
      {...props}
    />
  );
}
