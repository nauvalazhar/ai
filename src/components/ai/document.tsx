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

type DocumentContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsedHeight: number;
  contentId: string;
};

const DocumentContext = createContext<DocumentContextValue | null>(null);

function useDocumentContext() {
  const ctx = useContext(DocumentContext);
  if (!ctx) {
    throw new Error("Document parts must be rendered inside <Document>.");
  }
  return ctx;
}

type DocumentProps = React.ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  collapsedHeight?: number;
};

export function Document({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  collapsedHeight = 200,
  className,
  ...props
}: DocumentProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const contentId = useId();

  const setOpen = (next: boolean) => {
    if (!isControlled) setOpenState(next);
    onOpenChange?.(next);
  };

  return (
    <DocumentContext.Provider
      value={{ open, setOpen, collapsedHeight, contentId }}
    >
      <div
        data-slot="document"
        data-open={open || undefined}
        className={cn(
          "group/document flex flex-col rounded-outer bg-surface ring ring-border",
          className,
        )}
        {...props}
      />
    </DocumentContext.Provider>
  );
}

export function DocumentHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="document-header"
      className={cn("flex items-center gap-2 px-4 h-11", className)}
      {...props}
    />
  );
}

export function DocumentTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="document-title"
      className={cn(
        "flex-1 min-w-0 text-sm font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function DocumentAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="document-action"
      className={cn("flex items-center gap-0.5 -mr-1.5", className)}
      {...props}
    />
  );
}

export function DocumentTrigger({
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  const { open, setOpen, contentId } = useDocumentContext();

  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "document-trigger",
      "data-open": open || undefined,
      "aria-expanded": open,
      "aria-controls": contentId,
      onClick: () => setOpen(!open),
    },
  });
}

export function DocumentContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, collapsedHeight, contentId } = useDocumentContext();
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
    fullHeight === null
      ? open
        ? undefined
        : collapsedHeight
      : open
        ? fullHeight
        : collapsedHeight;

  return (
    <div
      id={contentId}
      data-slot="document-content"
      data-open={open || undefined}
      className={cn(
        "relative overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className,
      )}
      style={{ height: height !== undefined ? `${height}px` : undefined }}
      {...props}
    >
      <div ref={innerRef} className="px-4 pb-3">
        {children}
      </div>
      <div
        aria-hidden
        data-slot="document-fade"
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-20",
          "bg-linear-to-t from-surface to-transparent rounded-b",
          "transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "opacity-100 group-data-open/document:opacity-0",
        )}
      />
    </div>
  );
}
