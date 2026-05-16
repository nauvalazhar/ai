import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "#/lib/utils";

type ToolState = "running" | "success" | "error";

type ToolProps = Collapsible.Root.Props & {
  state?: ToolState;
};

export function Tool({ state, className, ...props }: ToolProps) {
  return (
    <Collapsible.Root
      data-slot="tool"
      data-state={state}
      className={cn(
        "group/tool flex flex-col rounded-outer bg-surface ring ring-border p-1",
        "data-[state=error]:ring-destructive/30",
        className,
      )}
      {...props}
    />
  );
}

export function ToolTrigger({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  return (
    <Collapsible.Trigger
      data-slot="tool-trigger"
      className={cn(
        "flex w-full items-center gap-2 cursor-pointer select-none text-left bg-transparent",
        "rounded px-3.5 py-2.5 text-muted-foreground",
        "hover:bg-accent hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "transition-colors",
        "group-data-[state=error]/tool:text-destructive group-data-[state=error]/tool:hover:text-destructive",
        className,
      )}
      {...props}
    >
      {children}
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
        className={cn(
          "ml-auto size-4 shrink-0 transition-transform duration-200",
          "group-data-open/tool:rotate-90",
        )}
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Collapsible.Trigger>
  );
}

export function ToolIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tool-icon"
      aria-hidden
      className={cn(
        "size-4.5 inline-flex items-center justify-center shrink-0",
        "[&_svg]:size-4.5",
        className,
      )}
      {...props}
    >
      <span className="contents group-data-[state=running]/tool:hidden">
        {children}
      </span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="hidden animate-spin group-data-[state=running]/tool:block"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </span>
  );
}

export function ToolName({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tool-name"
      className={cn(
        "font-mono text-foreground text-sm",
        "group-data-[state=error]/tool:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function ToolLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tool-label"
      className={cn(
        "min-w-0 truncate text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ToolContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="tool-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-150 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-2 px-3.5 pt-1.5 pb-2.5">{children}</div>
    </Collapsible.Panel>
  );
}

export function ToolSubtitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tool-subtitle"
      className={cn("text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}

export function ToolBlock({
  className,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      data-slot="tool-block"
      className={cn(
        "max-h-64 overflow-auto",
        "rounded bg-surface-elevated ring ring-border p-3",
        "text-sm font-mono text-foreground",
        "whitespace-pre-wrap wrap-break-word",
        className,
      )}
      {...props}
    />
  );
}

export function ToolError({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tool-error"
      className={cn(
        "hidden group-data-[state=error]/tool:block",
        "rounded bg-destructive/10 ring ring-destructive/30 p-2.5",
        "text-sm text-destructive",
        className,
      )}
      {...props}
    />
  );
}
