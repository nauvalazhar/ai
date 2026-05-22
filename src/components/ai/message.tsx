import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

type MessageProps = React.ComponentProps<"div"> & {
  type?: "incoming" | "outgoing";
};

export function Message({
  type = "outgoing",
  className,
  ...props
}: MessageProps) {
  return (
    <div
      data-slot="message"
      data-type={type}
      className={cn(
        "group/message flex w-full gap-3",
        "data-[type=outgoing]:flex-row-reverse",
        className,
      )}
      {...props}
    />
  );
}

export function MessageAvatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      className={cn(
        "relative flex size-9.5 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-medium text-muted-foreground",
        "[&>img]:size-full [&>img]:object-cover",
        className,
      )}
      {...props}
    />
  );
}

export function MessageContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-1.5",
        "group-data-[type=outgoing]/message:items-end",
        className,
      )}
      {...props}
    />
  );
}

export const messageTextVariants = cva("min-w-0 text-sm/6.5", {
  variants: {
    variant: {
      plain:
        "[[data-slot=message-avatar]+[data-slot=message-content]>&:first-child]:pt-2",
      bubble:
        "w-fit max-w-[75%] rounded-outer bg-surface-elevated px-3 py-2 ring ring-border",
    },
  },
  defaultVariants: { variant: "plain" },
});

type MessageTextProps = React.ComponentProps<"div"> &
  VariantProps<typeof messageTextVariants>;

export function MessageText({
  variant,
  className,
  ...props
}: MessageTextProps) {
  return (
    <div
      data-slot="message-text"
      data-variant={variant ?? "plain"}
      className={cn(messageTextVariants({ variant, className }))}
      {...props}
    />
  );
}

export function MessageAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="message-action"
      className={cn(
        "flex items-center gap-0.5",
        "[[data-slot=message-text][data-variant=plain]~&]:-mx-2",
        className,
      )}
      {...props}
    />
  );
}
