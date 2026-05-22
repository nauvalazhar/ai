import { Collapsible } from "@base-ui/react/collapsible";
import { createContext, useContext } from "react";
import { cn } from "#/lib/utils";

type SpecContextValue = { cols: string };

const SpecContext = createContext<SpecContextValue>({
  cols: "grid-cols-2",
});

type SpecProps = React.ComponentProps<"div"> & {
  cols?: string;
};

export function Spec({
  cols = "grid-cols-2",
  className,
  children,
  ...props
}: SpecProps) {
  return (
    <SpecContext.Provider value={{ cols }}>
      <div
        data-slot="spec"
        className={cn(
          "p-1 bg-surface rounded-outer ring ring-border flex flex-col gap-2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SpecContext.Provider>
  );
}

export function SpecHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { cols } = useContext(SpecContext);
  return (
    <div
      data-slot="spec-header"
      className={cn(
        "px-3 py-2 flex items-center gap-3",
        "text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    >
      <div className={cn("flex-1 grid items-center gap-3", cols)}>
        {children}
      </div>
      <div aria-hidden className="size-4 shrink-0" />
    </div>
  );
}

export function SpecItem({ className, ...props }: Collapsible.Root.Props) {
  return (
    <Collapsible.Root
      data-slot="spec-item"
      className={cn(
        "group rounded",
        "data-open:bg-surface-elevated ring ring-transparent data-open:ring-border",
        "transition-all duration-150",
        className,
      )}
      {...props}
    />
  );
}

export function SpecTrigger({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  const { cols } = useContext(SpecContext);
  return (
    <Collapsible.Trigger
      data-slot="spec-trigger"
      className={cn(
        "cursor-pointer select-none w-full text-left bg-transparent",
        "px-3 py-2 flex items-center gap-3 text-sm",
        "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "not-data-panel-open:hover:bg-accent",
        "transition-all duration-150",
        className,
      )}
      {...props}
    >
      <div className={cn("flex-1 grid items-center gap-3", cols)}>
        {children}
      </div>
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
          "size-4 shrink-0",
          "text-muted-foreground transition-transform duration-200",
          "group-data-open:rotate-180",
        )}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </Collapsible.Trigger>
  );
}

export function SpecContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="spec-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-150 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        "border-t border-transparent data-open:border-border",
        className,
      )}
      {...props}
    >
      <div className="px-3 py-2 flex flex-col gap-4">{children}</div>
    </Collapsible.Panel>
  );
}

export function SpecField({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { cols } = useContext(SpecContext);
  return (
    <div
      data-slot="spec-field"
      className={cn("flex items-start gap-3 text-sm", className)}
      {...props}
    >
      <div className={cn("flex-1 grid items-start gap-3", cols)}>
        {children}
      </div>
      <div aria-hidden className="size-4 shrink-0" />
    </div>
  );
}

export function SpecFieldLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="spec-field-label"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export function SpecFieldValue({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="spec-field-value"
      className={cn("min-w-0 col-[2/-1]", className)}
      {...props}
    />
  );
}
