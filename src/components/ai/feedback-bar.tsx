import { useRender } from "@base-ui/react/use-render";
import { createContext, use, useState } from "react";
import { cn } from "#/lib/utils";

type FeedbackBarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const FeedbackBarContext = createContext<FeedbackBarContextValue | null>(null);

function useFeedbackBarContext() {
  const ctx = use(FeedbackBarContext);
  if (!ctx) {
    throw new Error("FeedbackBar parts must be rendered inside <FeedbackBar>.");
  }
  return ctx;
}

type FeedbackBarProps = useRender.ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function FeedbackBar({
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  className,
  render,
  ...props
}: FeedbackBarProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;

  const setOpen = (next: boolean) => {
    if (!isControlled) setOpenState(next);
    onOpenChange?.(next);
  };

  const element = useRender({
    render,
    defaultTagName: "div",
    props: {
      ...props,
      "data-slot": "feedback-bar",
      className: cn(
        "inline-flex items-center gap-3 rounded-outer bg-surface ring ring-border",
        "py-1.5 pl-3 pr-1.5 text-sm text-foreground",
        className,
      ),
    },
  });

  if (!open) return null;

  return (
    <FeedbackBarContext value={{ open, setOpen }}>{element}</FeedbackBarContext>
  );
}

export function FeedbackBarIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="feedback-bar-icon"
      aria-hidden
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground",
        "[&>svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function FeedbackBarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="feedback-bar-content"
      className={cn("min-w-0 flex-1 text-sm text-foreground", className)}
      {...props}
    />
  );
}

export function FeedbackBarAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="feedback-bar-action"
      className={cn("inline-flex items-center gap-0.5 shrink-0", className)}
      {...props}
    />
  );
}

export function FeedbackBarDismiss({
  onClick,
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  const { setOpen } = useFeedbackBarContext();

  return useRender({
    render,
    defaultTagName: "button",
    props: {
      type: "button",
      ...props,
      "data-slot": "feedback-bar-dismiss",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        setOpen(false);
      },
    },
  });
}
