import { cn } from "#/lib/utils";

export function CodeBlock({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block"
      className={cn(
        "p-1 bg-surface rounded-outer ring ring-border flex flex-col gap-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CodeBlockHeader({
  children,
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="code-block-header"
      className={cn("px-3.5 h-8 flex items-center", className)}
      {...props}
    >
      {children}
    </header>
  );
}

export function CodeBlockTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn("text-xs font-medium text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CodeBlockAction({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-action"
      className={cn(
        "ml-auto flex items-center gap-1",
        "**:[button]:text-sm **:[svg]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CodeBlockContent({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-content"
      className={cn(
        "bg-surface-elevated ring ring-border rounded [&_pre]:text-sm font-mono",
        "px-3.5 py-2.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
