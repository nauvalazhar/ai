import { useRender } from "@base-ui/react/use-render";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "#/lib/utils";

type TodoStatus = "pending" | "in_progress" | "completed";

type TodoContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
};

const TodoContext = createContext<TodoContextValue | null>(null);

function useTodoContext() {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("Todo parts must be rendered inside <Todo>.");
  }
  return ctx;
}

const TodoItemContext = createContext<TodoStatus | null>(null);

function useTodoItemStatus() {
  const status = useContext(TodoItemContext);
  if (!status) {
    throw new Error("TodoItem parts must be used inside <TodoItem>");
  }
  return status;
}

type TodoProps = React.ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Todo({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  ...props
}: TodoProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const contentId = useId();

  const setOpen = (next: boolean) => {
    if (!isControlled) setOpenState(next);
    onOpenChange?.(next);
  };

  return (
    <TodoContext.Provider value={{ open, setOpen, contentId }}>
      <div
        data-slot="todo"
        data-open={open || undefined}
        className={cn(
          "group/todo flex flex-col rounded-outer bg-surface ring ring-border p-1",
          className,
        )}
        {...props}
      />
    </TodoContext.Provider>
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

export function TodoTrigger({
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  const { open, setOpen, contentId } = useTodoContext();
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "todo-trigger",
      "data-open": open || undefined,
      "aria-expanded": open,
      "aria-controls": contentId,
      onClick: () => setOpen(!open),
    },
  });
}

export function TodoContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, contentId } = useTodoContext();
  const innerRef = useRef<HTMLDivElement>(null);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const update = () => setFullHeight(el.scrollHeight);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const height =
    fullHeight === null ? (open ? undefined : 0) : open ? fullHeight : 0;

  return (
    <div
      id={contentId}
      data-slot="todo-content"
      data-open={open || undefined}
      className={cn(
        "overflow-hidden transition-[height] duration-200 ease-out",
        className,
      )}
      style={{ height: height !== undefined ? `${height}px` : undefined }}
      {...props}
    >
      <div ref={innerRef}>{children}</div>
    </div>
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
    <TodoItemContext.Provider value={status}>
      <li
        data-slot="todo-item"
        data-status={status}
        className={cn(
          "flex items-start gap-2.5 rounded px-3.5 py-1.5 text-sm",
          className,
        )}
        {...props}
      />
    </TodoItemContext.Provider>
  );
}

export function TodoItemIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const status = useTodoItemStatus();
  return (
    <span
      data-slot="todo-item-icon"
      aria-hidden
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center",
        status === "pending" ? "text-muted-foreground" : "text-foreground",
        className,
      )}
      {...props}
    >
      {children ?? <TodoStatusIcon status={status} />}
    </span>
  );
}

function TodoStatusIcon({ status }: { status: TodoStatus }) {
  if (status === "completed") {
    return (
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
        className="size-4"
      >
        <rect width="18" height="18" x="3" y="3" rx="3" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (status === "in_progress") {
    return (
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
        className="size-4 animate-spin"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );
  }
  return (
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
      className="size-4"
    >
      <rect width="18" height="18" x="3" y="3" rx="3" />
    </svg>
  );
}

export function TodoItemLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const status = useTodoItemStatus();
  return (
    <span
      data-slot="todo-item-label"
      className={cn(
        "min-w-0 flex-1 leading-5",
        status === "completed"
          ? "text-muted-foreground line-through"
          : "text-foreground",
        className,
      )}
      {...props}
    />
  );
}
