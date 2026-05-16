import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "#/lib/utils";

export function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      data-slot="tabs"
      className={cn("flex flex-col min-h-0", className)}
      {...props}
    />
  );
}

export function TabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      className={cn(
        "relative z-0 inline-flex items-center gap-1.5 shrink-0",
        "bg-background/60 backdrop-blur-xs w-auto self-start rounded-outer p-1",
        "ring ring-site-border",
        className,
      )}
      {...props}
    >
      {children}
      <BaseTabs.Indicator
        className={cn(
          "absolute top-1/2 left-0 z-[-1] h-7.5 w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-1/2 rounded-xl bg-accent transition-all duration-200 ease-in-out",
        )}
      />
    </BaseTabs.List>
  );
}

export function TabsTab({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-tab"
      className={cn(
        "inline-flex items-center px-2.5 h-7.5 font-medium text-sm text-site-muted hover:text-foreground",
        "data-active:text-site-foreground",
        "outline-none focus-visible:text-foreground",
        "transition-all cursor-pointer",
        "[&_svg]:size-3.5 gap-1.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsPanel({
  className,
  ...props
}: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-panel"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}
