import { Collapsible } from "@base-ui/react/collapsible";
import { useRender } from "@base-ui/react/use-render";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "#/lib/utils";

export type ConsoleLevel = "log" | "info" | "warn" | "error" | "debug";

type ConsoleContextValue = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  setIsAtBottom: (value: boolean) => void;
  wasAtBottomRef: React.RefObject<boolean>;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
};

const ConsoleContext = createContext<ConsoleContextValue | null>(null);

function useConsoleContext() {
  const ctx = useContext(ConsoleContext);
  if (!ctx) {
    throw new Error("Console parts must be used inside <Console>");
  }
  return ctx;
}

export function useConsole() {
  const { isAtBottom, scrollToBottom } = useConsoleContext();
  return { isAtBottom, scrollToBottom };
}

export function Console({ className, ...props }: React.ComponentProps<"div">) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const wasAtBottomRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const v = viewportRef.current;
    if (!v) return;
    v.scrollTo({ top: v.scrollHeight, behavior });
  }, []);

  return (
    <ConsoleContext.Provider
      value={{
        viewportRef,
        isAtBottom,
        setIsAtBottom,
        wasAtBottomRef,
        scrollToBottom,
      }}
    >
      <div
        data-slot="console"
        data-at-bottom={isAtBottom ? "true" : "false"}
        className={cn("flex flex-col min-h-0", className)}
        {...props}
      />
    </ConsoleContext.Provider>
  );
}

export function ConsoleContent({
  className,
  children,
  onScroll,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const { viewportRef, isAtBottom, setIsAtBottom, wasAtBottomRef } =
    useConsoleContext();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const recompute = useCallback(() => {
    const v = viewportRef.current;
    if (!v) return;
    const distance = v.scrollHeight - v.scrollTop - v.clientHeight;
    const atBottom = distance < 24;
    wasAtBottomRef.current = atBottom;
    setIsAtBottom(atBottom);
  }, [viewportRef, setIsAtBottom, wasAtBottomRef]);

  useEffect(() => {
    const v = viewportRef.current;
    if (!v) return;
    v.scrollTop = v.scrollHeight;
    recompute();
  }, [recompute, viewportRef]);

  useEffect(() => {
    const c = contentRef.current;
    const v = viewportRef.current;
    if (!c || !v) return;
    const ro = new ResizeObserver(() => {
      if (wasAtBottomRef.current) {
        v.scrollTop = v.scrollHeight;
      }
      recompute();
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, [recompute, viewportRef, wasAtBottomRef]);

  return useRender({
    render,
    defaultTagName: "div",
    ref: viewportRef,
    props: {
      ...props,
      "data-slot": "console-content",
      "data-at-bottom": isAtBottom ? "true" : "false",
      onScroll: (event: React.UIEvent<HTMLDivElement>) => {
        recompute();
        onScroll?.(event);
      },
      className: cn(
        "min-h-0 flex-1",
        render === undefined && "overflow-y-auto overscroll-contain",
        className,
      ),
      children: <div ref={contentRef}>{children}</div>,
    },
  });
}

export function ConsoleList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="console-list"
      className={cn("divide-y divide-border font-mono text-xs", className)}
      {...props}
    />
  );
}

const levelStyles: Record<ConsoleLevel, string> = {
  log: "text-foreground/70",
  info: "text-muted-foreground",
  warn: "text-amber-500",
  error: "text-red-500",
  debug: "text-blue-500",
};

const levelIcons: Record<ConsoleLevel, React.ReactNode> = {
  log: (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  warn: (
    <>
      <path d="M21.73 18 13.73 3.99a2 2 0 0 0-3.46 0L2.27 18a2 2 0 0 0 1.73 3h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </>
  ),
  debug: (
    <>
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </>
  ),
};

type ConsoleEntryProps = React.ComponentProps<"li"> & {
  level?: ConsoleLevel;
};

export function ConsoleEntry({
  level = "log",
  className,
  children,
  ...props
}: ConsoleEntryProps) {
  return (
    <li
      data-slot="console-entry"
      data-level={level}
      className={cn("flex items-start gap-2.5 px-4 py-2", className)}
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
        className={cn("size-3.5 shrink-0 mt-0.5", levelStyles[level])}
      >
        {levelIcons[level]}
      </svg>
      <div className="min-w-0 flex-1 flex items-start gap-2.5 text-foreground/80">
        {children}
      </div>
    </li>
  );
}

export function ConsoleTimestamp({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="console-timestamp"
      className={cn(
        "shrink-0 tabular-nums text-muted-foreground/70",
        className,
      )}
      {...props}
    />
  );
}

export function ConsoleSource({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="console-source"
      className={cn("ml-auto shrink-0 text-muted-foreground/70", className)}
      {...props}
    />
  );
}

export function ConsoleStack({ className, ...props }: Collapsible.Root.Props) {
  return (
    <Collapsible.Root
      data-slot="console-stack"
      className={cn("group min-w-0 flex-1", className)}
      {...props}
    />
  );
}

export function ConsoleStackTrigger({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  return (
    <Collapsible.Trigger
      data-slot="console-stack-trigger"
      className={cn(
        "cursor-pointer select-none bg-transparent",
        "inline-flex items-start gap-1.5 text-left",
        "hover:text-foreground transition-colors",
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
        className="size-3 shrink-0 mt-0.5 transition-transform duration-200 group-data-open:rotate-90 text-muted-foreground"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
      <span className="min-w-0">{children}</span>
    </Collapsible.Trigger>
  );
}

export function ConsoleStackContent({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="console-stack-content"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-150 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      <pre className="pl-4.5 pt-1 text-muted-foreground whitespace-pre-wrap">
        {children}
      </pre>
    </Collapsible.Panel>
  );
}
