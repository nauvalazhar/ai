import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "#/lib/utils";

type AgentRunState = "running" | "completed" | "failed" | "stopped";

type AgentRunProps = Collapsible.Root.Props & {
  state?: AgentRunState;
};

export function AgentRun({ state, className, ...props }: AgentRunProps) {
  return (
    <Collapsible.Root
      data-slot="agent-run"
      data-state={state}
      className={cn(
        "group/run flex flex-col rounded-outer bg-surface border border-border",
        "data-[state=running]:border-inflight/60",
        "data-[state=running]:ring-2",
        "data-[state=running]:ring-inflight/40",
        "data-[state=failed]:border-destructive/60",
        "data-[state=failed]:ring-2",
        "data-[state=failed]:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export function AgentRunHeader({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  return (
    <Collapsible.Trigger
      data-slot="agent-run-header"
      className={cn(
        "flex w-full items-center gap-3 cursor-pointer select-none text-left bg-transparent",
        "rounded-outer px-4 py-3 text-foreground text-sm",
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
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
          "group-data-open/run:rotate-90",
        )}
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
      {children}
    </Collapsible.Trigger>
  );
}

export function AgentRunTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="agent-run-title"
      className={cn(
        "min-w-0 truncate font-medium text-foreground",
        "group-data-[state=failed]/run:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function AgentRunMeta({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="agent-run-meta"
      className={cn(
        "ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function AgentRunContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="agent-run-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-150 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex flex-col px-4 pb-4",
          "[&_[data-slot=agent-run-step]:not(:has([data-slot=agent-run-text]))+[data-slot=agent-run-step]:has([data-slot=agent-run-text])]:mt-2",
          "[&_[data-slot=agent-run-step]:has([data-slot=agent-run-text])+[data-slot=agent-run-step]:not(:has([data-slot=agent-run-text]))]:mt-2",
        )}
      >
        {children}
      </div>
    </Collapsible.Panel>
  );
}

export function AgentRunStep({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="agent-run-step"
      className={cn("flex flex-col text-sm text-foreground", className)}
      {...props}
    />
  );
}

export function AgentRunText({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="agent-run-text"
      className={cn(
        "text-sm text-muted-foreground",
        "[&_code]:rounded [&_code]:bg-surface-elevated [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-foreground [&_code]:font-mono [&_code]:text-xs",
        className,
      )}
      {...props}
    />
  );
}
