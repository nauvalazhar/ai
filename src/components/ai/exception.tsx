import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "#/lib/utils";

export function Exception({ className, ...props }: Collapsible.Root.Props) {
  return (
    <Collapsible.Root
      data-slot="exception"
      className={cn(
        "group/exception flex flex-col",
        "rounded-outer bg-surface ring ring-border",
        "overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

export function ExceptionHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="exception-header"
      className={cn("flex items-center gap-2.5 px-3 py-2", className)}
      {...props}
    />
  );
}

export function ExceptionType({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="exception-type"
      className={cn(
        "shrink-0 self-start mt-0.5",
        "font-mono text-xs font-medium",
        "rounded bg-destructive/10 text-destructive",
        "px-1.5 py-0.5",
        className,
      )}
      {...props}
    />
  );
}

export function ExceptionMessage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="exception-message"
      className={cn("min-w-0 flex-1 text-sm text-foreground", className)}
      {...props}
    />
  );
}

export function ExceptionAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="exception-action"
      className={cn(
        "shrink-0 flex items-center gap-1",
        "**:[button]:text-sm **:[svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function ExceptionTrigger({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  return (
    <Collapsible.Trigger
      data-slot="exception-trigger"
      className={cn(
        "cursor-pointer select-none bg-transparent",
        "inline-flex items-center gap-1 px-1.5 py-1 rounded",
        "text-xs text-muted-foreground hover:text-foreground hover:bg-muted",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "transition-colors",
        className,
      )}
      {...props}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="size-3.5 shrink-0 transition-transform duration-200 group-data-open/exception:rotate-90"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
      {children}
    </Collapsible.Trigger>
  );
}

export function ExceptionContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="exception-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-150 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="px-3 pb-3 pt-0.5">{children}</div>
    </Collapsible.Panel>
  );
}

export function ExceptionFrames({
  className,
  ...props
}: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="exception-frames"
      className={cn(
        "font-mono text-xs",
        "rounded bg-surface-elevated ring ring-border",
        "overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

type ExceptionFrameProps = React.ComponentProps<"li"> & {
  active?: boolean;
  internal?: boolean;
};

export function ExceptionFrame({
  active,
  internal,
  className,
  ...props
}: ExceptionFrameProps) {
  return (
    <li
      data-slot="exception-frame"
      data-active={active ? "true" : undefined}
      data-internal={internal ? "true" : undefined}
      className={cn(
        "flex items-baseline gap-2 px-3 py-1.5",
        "border-l-2 border-transparent",
        "data-[active=true]:border-destructive data-[active=true]:bg-destructive/5",
        "data-[internal=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function ExceptionFrameFunction({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="exception-frame-function"
      className={cn("shrink-0 text-foreground", className)}
      {...props}
    />
  );
}

export function ExceptionFrameLocation({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="exception-frame-location"
      className={cn(
        "ml-auto min-w-0 truncate text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ExceptionSource({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="exception-source"
      className={cn(
        "mx-3.5 mb-3 rounded ring ring-border bg-surface-elevated overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

export function ExceptionSourceHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="exception-source-header"
      className={cn(
        "flex items-center justify-between gap-2.5 px-3 py-2",
        "border-b border-border",
        "font-mono text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ExceptionSourceContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="exception-source-content"
      className={cn(
        "text-xs leading-relaxed px-3 py-2",
        "[&_pre]:bg-transparent! [&_pre]:outline-none!",
        "[&_code]:flex [&_code]:flex-col",
        "**:data-[active=true]:bg-destructive/5",
        "**:data-[active=true]:border-l-2",
        "**:data-[active=true]:border-destructive",
        "**:data-[active=true]:-mx-3",
        "**:data-[active=true]:px-2.5",
        className,
      )}
      {...props}
    />
  );
}
