import { cn } from "#/lib/utils";

export function Task({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="task"
      className={cn("flex flex-col text-sm", className)}
      {...props}
    />
  );
}

export function TaskItem({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="task-item"
      className={cn(
        "flex flex-col",
        "last:**:data-rail-connector:hidden",
        className,
      )}
      {...props}
    >
      <div className="inline-flex items-center self-start gap-2 px-2 py-1 text-muted-foreground">
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

export function TaskIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="task-icon"
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

export function TaskLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="task-label"
      className={cn("text-foreground", className)}
      {...props}
    />
  );
}
