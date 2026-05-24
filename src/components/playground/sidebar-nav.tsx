import { cloneElement, type ReactElement, type ReactNode } from "react";
import { Collapsible } from "@base-ui/react/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "#/lib/utils";

type Renderable = ReactElement<{ className?: string; children?: ReactNode }>;

export function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-3">
      <div className="px-6 py-1 text-xs font-medium text-muted-foreground">
        {title}
      </div>
      <ul className="px-4">{children}</ul>
    </section>
  );
}

const itemClass = cn(
  "flex items-center gap-2 pl-5.5 pr-2 py-1 rounded text-sm",
  "text-muted-foreground hover:bg-accent hover:text-foreground",
  "data-[status=active]:bg-accent data-[status=active]:text-foreground",
  "outline-none focus-visible:ring-2 focus-visible:ring-primary",
  "transition-colors duration-150",
);

export function SidebarItem({
  icon,
  render,
  children,
}: {
  icon?: ReactNode;
  render: Renderable;
  children: ReactNode;
}) {
  return (
    <li className="mb-0.5">
      {cloneElement(render, {
        className: cn(itemClass, render.props.className),
        children: (
          <>
            {icon}
            <span className="truncate">{children}</span>
          </>
        ),
      })}
    </li>
  );
}

const groupRowClass = "flex items-center rounded text-sm hover:bg-accent";
const groupLinkClass = cn(
  "flex items-center gap-2 flex-1 min-w-0 py-1 pr-2",
  "text-muted-foreground hover:text-foreground",
  "data-[status=active]:text-foreground",
  "outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
  "transition-colors duration-150",
);
const groupTriggerClass = cn(
  "p-1 text-muted-foreground hover:text-foreground rounded",
  "outline-none focus-visible:ring-2 focus-visible:ring-primary",
);
const groupPanelClass = cn(
  "overflow-hidden h-(--collapsible-panel-height)",
  "transition-[height] duration-150 ease-out",
  "data-starting-style:h-0 data-ending-style:h-0",
);
const groupListClass = "ml-2.5 pl-1.5 border-l border-border mt-0.5 space-y-0.5";

export function SidebarGroup({
  icon,
  label,
  render,
  open,
  onOpenChange,
  isActive,
  children,
}: {
  icon?: ReactNode | ((open: boolean) => ReactNode);
  label: string;
  render: Renderable;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive?: boolean;
  children: ReactNode;
}) {
  const resolvedIcon = typeof icon === "function" ? icon(open) : icon;
  return (
    <li className="mb-0.5">
      <Collapsible.Root
        className="group"
        open={open}
        onOpenChange={onOpenChange}
      >
        <div
          className={cn(groupRowClass, isActive && "bg-accent text-foreground")}
        >
          <Collapsible.Trigger
            className={groupTriggerClass}
            aria-label={open ? "Collapse" : "Expand"}
          >
            <ChevronRight className="size-3.5 transition-transform group-data-open:rotate-90" />
          </Collapsible.Trigger>
          {cloneElement(render, {
            className: cn(
              groupLinkClass,
              isActive && "text-foreground",
              render.props.className,
            ),
            children: (
              <>
                {resolvedIcon}
                <span className="truncate">{label}</span>
              </>
            ),
          })}
        </div>
        <Collapsible.Panel className={groupPanelClass}>
          <ul className={groupListClass}>{children}</ul>
        </Collapsible.Panel>
      </Collapsible.Root>
    </li>
  );
}

const subItemClass = cn(
  "flex items-center gap-2 px-1.5 py-1 rounded text-sm",
  "text-muted-foreground hover:bg-accent hover:text-foreground",
  "data-[status=active]:bg-accent data-[status=active]:text-foreground",
  "outline-none focus-visible:ring-2 focus-visible:ring-primary",
  "transition-colors duration-150",
);

export function SidebarSubItem({
  icon,
  render,
  children,
}: {
  icon?: ReactNode;
  render: Renderable;
  children: ReactNode;
}) {
  return (
    <li>
      {cloneElement(render, {
        className: cn(subItemClass, render.props.className),
        children: (
          <>
            {icon}
            <span className="truncate">{children}</span>
          </>
        ),
      })}
    </li>
  );
}
