import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "#/lib/utils";

export function ChainOfThought({
  className,
  ...props
}: Collapsible.Root.Props) {
  return (
    <Collapsible.Root
      data-slot="chain-of-thought"
      className={cn("group/cot flex flex-col text-sm", className)}
      {...props}
    />
  );
}

export function ChainOfThoughtHeader({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  return (
    <Collapsible.Trigger
      data-slot="chain-of-thought-header"
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
          "group-data-open/cot:rotate-90",
        )}
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Collapsible.Trigger>
  );
}

export function ChainOfThoughtContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="chain-of-thought-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-150 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col">
        <span aria-hidden className="w-px h-4 ml-4 bg-border" />
        {children}
      </div>
    </Collapsible.Panel>
  );
}

export function ChainOfThoughtStep({
  className,
  children,
  ...props
}: Collapsible.Root.Props) {
  return (
    <Collapsible.Root
      data-slot="chain-of-thought-step"
      className={cn(
        "group/step flex flex-col",
        "last:**:data-rail-panel:hidden",
        "last:**:data-rail-connector:hidden",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        data-rail-connector
        className="w-px h-4 ml-4 bg-border"
      />
    </Collapsible.Root>
  );
}

export function ChainOfThoughtStepStatic({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chain-of-thought-step-static"
      className={cn(
        "group/step flex flex-col",
        "last:**:data-rail-connector:hidden",
        className,
      )}
    >
      <div
        className={cn(
          "inline-flex items-start self-start gap-2 text-left",
          "px-2 py-1 text-muted-foreground",
          "*:data-[slot=chain-of-thought-icon]:h-5",
        )}
        {...props}
      >
        {children}
      </div>
      <span
        aria-hidden
        data-rail-connector
        className="w-px h-4 ml-4 bg-border"
      />
    </div>
  );
}

export function ChainOfThoughtStepTrigger({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  return (
    <Collapsible.Trigger
      data-slot="chain-of-thought-step-trigger"
      className={cn(
        "inline-flex items-center self-start gap-2 cursor-pointer select-none text-left bg-transparent",
        "px-2 py-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
        "transition-colors",
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
          "size-4 shrink-0 transition-transform duration-200",
          "group-data-open/step:rotate-90",
        )}
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Collapsible.Trigger>
  );
}

export function ChainOfThoughtIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chain-of-thought-icon"
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

export function ChainOfThoughtStepContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="chain-of-thought-step-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-150 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="relative pl-8 pt-1 text-muted-foreground">
        <span
          data-rail-panel
          aria-hidden
          className="absolute top-0 bottom-0 left-4 w-px bg-border"
        />
        {children}
      </div>
    </Collapsible.Panel>
  );
}
