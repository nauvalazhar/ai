import { Popover } from "@base-ui/react/popover";
import { useRender } from "@base-ui/react/use-render";
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "#/lib/utils";

type CitationContextValue = {
  index: number;
  total: number;
  direction: 1 | -1;
  setIndex: (next: number) => void;
  next: () => void;
  prev: () => void;
};

type InternalContextValue = {
  setTotal: (n: number) => void;
};

const CitationContext = createContext<CitationContextValue | null>(null);
const CitationInternalContext = createContext<InternalContextValue | null>(
  null,
);

function useCitationContext() {
  const ctx = useContext(CitationContext);
  if (!ctx) {
    throw new Error("Citation parts must be used inside <Citation>");
  }
  return ctx;
}

export function useCitation() {
  return useCitationContext();
}

export function Citation({ children, ...props }: Popover.Root.Props) {
  const [index, setIndexState] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [total, setTotal] = useState(0);

  const setIndex = useCallback((nextIndex: number) => {
    setIndexState((prev) => {
      if (nextIndex === prev) return prev;
      setDirection(nextIndex > prev ? 1 : -1);
      return nextIndex;
    });
  }, []);

  const next = useCallback(() => {
    setIndexState((prev) => {
      if (total === 0) return prev;
      setDirection(1);
      return (prev + 1) % total;
    });
  }, [total]);

  const prev = useCallback(() => {
    setIndexState((current) => {
      if (total === 0) return current;
      setDirection(-1);
      return (current - 1 + total) % total;
    });
  }, [total]);

  const value = useMemo(
    () => ({ index, total, direction, setIndex, next, prev }),
    [index, total, direction, setIndex, next, prev],
  );

  const internal = useMemo(() => ({ setTotal }), []);

  return (
    <CitationContext.Provider value={value}>
      <CitationInternalContext.Provider value={internal}>
        <Popover.Root {...props}>{children}</Popover.Root>
      </CitationInternalContext.Provider>
    </CitationContext.Provider>
  );
}

export function CitationTrigger({
  openOnHover = true,
  delay = 150,
  closeDelay = 200,
  className,
  ...props
}: Popover.Trigger.Props) {
  return (
    <Popover.Trigger
      openOnHover={openOnHover}
      delay={delay}
      closeDelay={closeDelay}
      data-slot="citation-trigger"
      className={cn(
        "inline-flex items-center gap-1.5 cursor-pointer select-none no-underline",
        "px-2 py-0.5 rounded text-xs",
        "bg-muted text-muted-foreground ring ring-border",
        "hover:bg-accent hover:text-foreground",
        "data-popup-open:bg-accent data-popup-open:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function CitationPopup({
  className,
  children,
  ...props
}: Popover.Popup.Props) {
  return (
    <Popover.Portal>
      <Popover.Positioner sideOffset={8} align="start">
        <Popover.Popup
          data-slot="citation-popup"
          className={cn(
            "w-80 max-w-[90vw] flex flex-col gap-1 p-1",
            "bg-surface rounded-outer ring ring-border shadow-lg",
            "origin-(--transform-origin) transition-[opacity,transform] duration-150",
            "data-starting-style:opacity-0 data-starting-style:scale-95",
            "data-ending-style:opacity-0 data-ending-style:scale-95",
            "focus-visible:outline-none",
            className,
          )}
          {...props}
        >
          {children}
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export function CitationHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="citation-header"
      className={cn("flex items-center gap-2 px-3.5 h-8", className)}
      {...props}
    />
  );
}

export function CitationNav({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { total } = useCitationContext();
  return (
    <div
      data-slot="citation-nav"
      data-single={total <= 1 ? "" : undefined}
      className={cn(
        "flex w-full items-center gap-1",
        "data-single:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function CitationPrev({
  render,
  onClick,
  ...props
}: useRender.ComponentProps<"button">) {
  const { prev } = useCitationContext();
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "citation-prev",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        prev();
        onClick?.(event);
      },
    },
  });
}

export function CitationNext({
  render,
  onClick,
  ...props
}: useRender.ComponentProps<"button">) {
  const { next } = useCitationContext();
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "citation-next",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        next();
        onClick?.(event);
      },
    },
  });
}

export function CitationIndicator({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const { index, total } = useCitationContext();
  return (
    <span
      data-slot="citation-indicator"
      className={cn(
        "ml-auto pr-1 text-xs text-muted-foreground tabular-nums",
        className,
      )}
      {...props}
    >
      {children ?? `${index + 1}/${Math.max(total, 1)}`}
    </span>
  );
}

export function CitationList({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const internal = useContext(CitationInternalContext);
  const { index } = useCitationContext();
  const items = Children.toArray(children);

  useLayoutEffect(() => {
    internal?.setTotal(items.length);
  }, [items.length, internal]);

  const safeIndex = items.length === 0 ? 0 : index % items.length;
  const active = items[safeIndex];

  return (
    <div
      data-slot="citation-list"
      className={cn(
        "relative bg-surface-elevated ring ring-border rounded p-3.5",
        className,
      )}
      {...props}
    >
      {isValidElement(active)
        ? cloneElement(active, { key: `citation-${safeIndex}` })
        : active}
    </div>
  );
}

type CitationItemProps = useRender.ComponentProps<"div">;

export function CitationItem({
  className,
  render,
  ...props
}: CitationItemProps) {
  const { direction } = useCitationContext();
  return useRender({
    render,
    defaultTagName: "div",
    props: {
      ...props,
      "data-slot": "citation-item",
      "data-direction": direction === 1 ? "next" : "prev",
      className: cn(
        "flex flex-col gap-1.5 rounded",
        "no-underline text-foreground bg-transparent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "transition-colors",
        "animate-[citation-enter-next_180ms_ease-out]",
        "data-[direction=prev]:animate-[citation-enter-prev_180ms_ease-out]",
        className,
      ),
    },
  });
}

export function CitationName({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="citation-name"
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        "[&>img]:size-4 [&>img]:rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export function CitationTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="citation-title"
      className={cn(
        "text-sm font-medium text-foreground leading-snug",
        className,
      )}
      {...props}
    />
  );
}

export function CitationDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="citation-description"
      className={cn(
        "text-xs text-muted-foreground leading-relaxed line-clamp-3",
        className,
      )}
      {...props}
    />
  );
}

export function CitationContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="citation-content"
      className={cn(
        "text-sm text-muted-foreground leading-relaxed",
        "[&>*+*]:mt-2",
        className,
      )}
      {...props}
    />
  );
}

export function CitationAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="citation-action"
      className={cn(
        "mt-3 pt-3 flex items-center gap-2 border-t border-border",
        "text-sm text-primary",
        className,
      )}
      {...props}
    />
  );
}
