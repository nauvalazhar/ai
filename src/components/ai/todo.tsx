import { Collapsible } from "@base-ui/react/collapsible";
import { cn } from "#/lib/utils";

type TodoStatus = "pending" | "in_progress" | "completed";

export function Todo({ className, ...props }: Collapsible.Root.Props) {
  return (
    <Collapsible.Root
      data-slot="todo"
      className={cn(
        "group/todo flex flex-col rounded-outer bg-surface ring ring-border p-1",
        className,
      )}
      {...props}
    />
  );
}

export function TodoHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="todo-header"
      className={cn("flex items-center gap-2 px-3.5 py-2.5", className)}
      {...props}
    />
  );
}

export function TodoTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="todo-title"
      className={cn(
        "flex-1 min-w-0 text-sm font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TodoTrigger(props: Collapsible.Trigger.Props) {
  return <Collapsible.Trigger data-slot="todo-trigger" {...props} />;
}

export function TodoContent({ className, ...props }: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="todo-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-200 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    />
  );
}

export function TodoList({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="todo-list"
      className={cn("flex flex-col pb-1", className)}
      {...props}
    />
  );
}

type TodoItemProps = React.ComponentProps<"li"> & {
  status: TodoStatus;
};

export function TodoItem({ status, className, ...props }: TodoItemProps) {
  return (
    <li
      data-slot="todo-item"
      data-status={status}
      className={cn(
        "flex items-start gap-2.5 rounded px-3.5 py-1.5 text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function TodoItemIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="todo-item-icon"
      aria-hidden
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center text-foreground",
        "in-data-[status=pending]:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children ?? <TodoStatusIcon />}
    </span>
  );
}

function TodoStatusIcon() {
  return (
    <>
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
        className="hidden size-4 in-data-[status=pending]:block"
      >
        <rect width="18" height="18" x="3" y="3" rx="3" />
      </svg>
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
        className="hidden size-4 animate-spin in-data-[status=in_progress]:block"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
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
        className="hidden size-4 in-data-[status=completed]:block"
      >
        <rect width="18" height="18" x="3" y="3" rx="3" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    </>
  );
}

export function TodoItemLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="todo-item-label"
      className={cn(
        "min-w-0 flex-1 leading-5 text-foreground",
        "in-data-[status=completed]:text-muted-foreground in-data-[status=completed]:line-through",
        className,
      )}
      {...props}
    />
  );
}
