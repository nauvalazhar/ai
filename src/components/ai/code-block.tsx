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

type CodeBlockContextValue = {
  clip: boolean;
  maxHeight: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  overflowing: boolean;
  setOverflowing: (overflowing: boolean) => void;
  contentId: string;
};

const CodeBlockContext = createContext<CodeBlockContextValue | null>(null);

function useCodeBlockContext() {
  const ctx = useContext(CodeBlockContext);
  if (!ctx) {
    throw new Error("CodeBlock parts must be rendered inside <CodeBlock>.");
  }
  return ctx;
}

type CodeBlockProps = React.ComponentProps<"div"> & {
  clip?: boolean;
  maxHeight?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CodeBlock({
  clip = false,
  maxHeight = 240,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  ...props
}: CodeBlockProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const [overflowing, setOverflowing] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const contentId = useId();

  const setOpen = (next: boolean) => {
    if (!isControlled) setOpenState(next);
    onOpenChange?.(next);
  };

  const clipped = clip && overflowing && !open;

  return (
    <CodeBlockContext.Provider
      value={{
        clip,
        maxHeight,
        open,
        setOpen,
        overflowing,
        setOverflowing,
        contentId,
      }}
    >
      <div
        data-slot="code-block"
        data-open={open || undefined}
        data-clipped={clipped || undefined}
        className={cn(
          "group/code-block",
          "p-1 bg-surface rounded-outer ring ring-border flex flex-col gap-1",
          className,
        )}
        {...props}
      />
    </CodeBlockContext.Provider>
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
  const { clip, maxHeight, open, contentId, setOverflowing } =
    useCodeBlockContext();
  const innerRef = useRef<HTMLDivElement>(null);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!clip) {
      setOverflowing(false);
      setFullHeight(null);
      return;
    }
    const el = innerRef.current;
    if (!el) return;

    const update = () => {
      const h = el.scrollHeight;
      setFullHeight(h);
      setOverflowing(h > maxHeight);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [clip, maxHeight, setOverflowing]);

  const isOverflowing = fullHeight !== null && fullHeight > maxHeight;
  const clipped = clip && isOverflowing && !open;
  const height = !clip
    ? undefined
    : fullHeight === null
      ? open
        ? undefined
        : maxHeight
      : isOverflowing
        ? open
          ? fullHeight
          : maxHeight
        : undefined;

  return (
    <div
      id={contentId}
      data-slot="code-block-content"
      data-open={open || undefined}
      data-clipped={clipped || undefined}
      className={cn(
        "bg-surface-elevated ring ring-border rounded [&_pre]:text-sm font-mono",
        "relative",
        clip &&
          "overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className,
      )}
      style={{ height: height !== undefined ? `${height}px` : undefined }}
      {...props}
    >
      <div ref={innerRef} className="px-3.5 py-2.5">
        {children}
      </div>
      {clip && (
        <div
          aria-hidden
          data-slot="code-block-fade"
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-16",
            "bg-linear-to-t from-surface-elevated to-transparent rounded-b",
            "transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            "opacity-0 group-data-clipped/code-block:opacity-100",
          )}
        />
      )}
    </div>
  );
}

export function CodeBlockTrigger({
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  const { open, setOpen, contentId, clip, overflowing } = useCodeBlockContext();

  const element = useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "code-block-trigger",
      "data-open": open || undefined,
      "aria-expanded": open,
      "aria-controls": contentId,
      onClick: () => setOpen(!open),
    },
  });

  if (!clip || !overflowing) return null;
  return element;
}
