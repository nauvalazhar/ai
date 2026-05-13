import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "#/lib/utils";

export function Action({ className, ...props }: Collapsible.Root.Props) {
  return (
    <Collapsible.Root
      data-slot="action"
      className={cn("group/action flex flex-col text-sm", className)}
      {...props}
    />
  );
}

export function ActionTrigger({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  return (
    <Collapsible.Trigger
      data-slot="action-trigger"
      className={cn(
        "inline-flex items-center self-start gap-2 cursor-pointer select-none text-left bg-transparent",
        "px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "transition-colors",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon
        aria-hidden
        className={cn(
          "size-4 shrink-0 transition-transform duration-200",
          "group-data-open/action:rotate-90",
        )}
      />
    </Collapsible.Trigger>
  );
}

export function ActionIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="action-icon"
      aria-hidden
      className={cn(
        "size-4 inline-flex items-center justify-center shrink-0",
        className,
      )}
      {...props}
    >
      {children ?? <span className="size-2 rounded-full bg-current" />}
    </span>
  );
}

export function ActionLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="action-label"
      className={cn("text-foreground", className)}
      {...props}
    />
  );
}

export function ActionContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="action-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-150 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="pl-8 pt-2 text-muted-foreground">{children}</div>
    </Collapsible.Panel>
  );
}
