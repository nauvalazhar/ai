import { Collapsible } from "@base-ui/react/collapsible";
import { Tabs } from "@base-ui/react/tabs";
import { cn } from "#/lib/utils";

type SandboxState = "running" | "success" | "error";

type SandboxProps = Collapsible.Root.Props & {
  state?: SandboxState;
};

export function Sandbox({ state, className, ...props }: SandboxProps) {
  return (
    <Collapsible.Root
      data-slot="sandbox"
      data-state={state}
      className={cn(
        "group/sandbox flex flex-col rounded-outer bg-surface ring ring-border overflow-hidden",
        "data-[state=error]:ring-destructive/30",
        className,
      )}
      {...props}
    />
  );
}

export function SandboxHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="sandbox-header"
      className={cn("flex items-center", className)}
      {...props}
    />
  );
}

export function SandboxTrigger({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  return (
    <Collapsible.Trigger
      data-slot="sandbox-trigger"
      className={cn(
        "min-w-0 flex-1 flex items-center gap-2 cursor-pointer select-none text-left bg-transparent",
        "px-4 h-11 text-muted-foreground rounded-outer data-panel-open:rounded-b-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
        "transition-all",
        "group-data-[state=error]/sandbox:text-destructive group-data-[state=error]/sandbox:hover:text-destructive",
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
          "size-4 shrink-0 transition-transform duration-200",
          "group-data-open/sandbox:rotate-90",
        )}
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
      {children}
    </Collapsible.Trigger>
  );
}

export function SandboxTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="sandbox-title"
      className={cn(
        "min-w-0 truncate font-mono text-sm text-foreground",
        "group-data-[state=error]/sandbox:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function SandboxAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sandbox-action"
      className={cn(
        "shrink-0 flex items-center gap-1 pr-4",
        "**:[button]:text-sm **:[svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function SandboxContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="sandbox-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-200 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="border-t border-border">{children}</div>
    </Collapsible.Panel>
  );
}

export function SandboxTabs({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Root>) {
  return (
    <Tabs.Root
      data-slot="sandbox-tabs"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

export function SandboxTabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Tabs.List>) {
  return (
    <Tabs.List
      data-slot="sandbox-tabs-list"
      className={cn(
        "relative flex items-stretch gap-4 px-4 border-b border-border",
        className,
      )}
      {...props}
    >
      {children}
      <Tabs.Indicator
        className={cn(
          "absolute bottom-0 left-0 h-px w-(--active-tab-width)",
          "translate-x-(--active-tab-left) bg-foreground",
          "transition-all duration-200 ease-out",
        )}
      />
    </Tabs.List>
  );
}

export function SandboxTab({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Tab>) {
  return (
    <Tabs.Tab
      data-slot="sandbox-tab"
      className={cn(
        "inline-flex items-center h-9 text-sm font-medium",
        "text-muted-foreground hover:text-foreground",
        "data-active:text-foreground",
        "outline-none focus-visible:text-foreground",
        "transition-colors cursor-pointer",
        "[&>svg]:size-4 gap-2",
        className,
      )}
      {...props}
    />
  );
}

export function SandboxPanel({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Panel>) {
  return (
    <Tabs.Panel
      data-slot="sandbox-panel"
      className={cn(
        "outline-none px-4 py-3",
        "[&_pre]:text-sm [&_pre]:font-mono",
        className,
      )}
      {...props}
    />
  );
}
