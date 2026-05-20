"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "#/lib/utils";
import { Button } from "./button";

type SelectionContextValue = {
  open: boolean;
  text: string;
  range: Range | null;
  rect: DOMRect | null;
  contentEl: HTMLElement | null;
  setContentEl: (el: HTMLElement | null) => void;
  setOpen: (open: boolean) => void;
  dismiss: () => void;
  clearSelection: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

function useSelectionContext() {
  const ctx = use(SelectionContext);
  if (!ctx) {
    throw new Error("Selection parts must be rendered inside <Selection>.");
  }
  return ctx;
}

export function useSelection() {
  const { text, range, rect, open, dismiss, clearSelection } =
    useSelectionContext();
  return { text, range, rect, open, dismiss, clearSelection };
}

type SelectionProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (text: string) => void;
};

export function Selection({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelect,
}: SelectionProps) {
  const [openState, setOpenState] = useState(defaultOpen);
  const [text, setText] = useState("");
  const [range, setRange] = useState<Range | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [contentEl, setContentEl] = useState<HTMLElement | null>(null);

  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;
  const openRef = useRef(open);
  openRef.current = open;

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openRef.current === next) return;
      if (!isControlled) setOpenState(next);
      onOpenChangeRef.current?.(next);
    },
    [isControlled],
  );

  const dismiss = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const clearSelection = useCallback(() => {
    if (typeof window === "undefined") return;
    window.getSelection()?.removeAllRanges();
  }, []);

  useEffect(() => {
    if (!contentEl || typeof document === "undefined") return;

    const isInsideToolbar = (target: EventTarget | null) =>
      target instanceof Element &&
      !!target.closest('[data-slot="selection-toolbar"]');

    const readSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return null;
      const r = sel.getRangeAt(0);
      if (
        !contentEl.contains(r.startContainer) ||
        !contentEl.contains(r.endContainer)
      ) {
        return null;
      }
      const rects = r.getClientRects();
      if (rects.length === 0) return null;
      const value = sel.toString();
      if (!value.trim()) return null;
      return { text: value, range: r, rect: rects[0] };
    };

    const handleSelectionChange = () => {
      const result = readSelection();
      if (!result) {
        if (openRef.current) {
          setOpen(false);
          setText("");
          setRange(null);
          setRect(null);
        }
        return;
      }
      setText(result.text);
      setRange(result.range);
      setRect(result.rect);
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (isInsideToolbar(event.target)) return;
      requestAnimationFrame(() => {
        const result = readSelection();
        if (!result) return;
        setText(result.text);
        setRange(result.range);
        setRect(result.rect);
        setOpen(true);
        onSelectRef.current?.(result.text);
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (isInsideToolbar(event.target)) return;
      if (
        openRef.current &&
        !contentEl.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openRef.current) {
        setOpen(false);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [contentEl, setOpen]);

  return (
    <SelectionContext
      value={{
        open,
        text,
        range,
        rect,
        contentEl,
        setContentEl,
        setOpen,
        dismiss,
        clearSelection,
      }}
    >
      {children}
    </SelectionContext>
  );
}

export function SelectionContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { setContentEl } = useSelectionContext();
  return (
    <div
      ref={setContentEl}
      data-slot="selection-content"
      className={cn(className)}
      {...props}
    />
  );
}

type SelectionToolbarProps = React.ComponentProps<"div"> & {
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  edgePadding?: number;
};

export function SelectionToolbar({
  side = "top",
  align = "start",
  sideOffset = 8,
  alignOffset = 0,
  edgePadding = 8,
  className,
  style,
  onMouseDown,
  ...props
}: SelectionToolbarProps) {
  const { open, range } = useSelectionContext();
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    side: "top" | "bottom";
    ready: boolean;
  }>({ top: 0, left: 0, side, ready: false });

  useEffect(() => {
    if (!open || !range || typeof window === "undefined") {
      setPosition((p) => ({ ...p, ready: false }));
      return;
    }

    const recompute = () => {
      const el = ref.current;
      if (!el) return;
      const rects = range.getClientRects();
      if (rects.length === 0) return;
      const anchor = rects[0];
      const size = el.getBoundingClientRect();

      const vv = window.visualViewport;
      const offsetTop = vv?.offsetTop ?? 0;
      const offsetLeft = vv?.offsetLeft ?? 0;
      const vw = vv?.width ?? window.innerWidth;
      const vh = vv?.height ?? window.innerHeight;

      const fits = (s: "top" | "bottom") =>
        s === "top"
          ? anchor.top - size.height - sideOffset >= offsetTop + edgePadding
          : anchor.bottom + sideOffset + size.height <=
            offsetTop + vh - edgePadding;

      let resolvedSide = side;
      if (!fits(side) && fits(side === "top" ? "bottom" : "top")) {
        resolvedSide = side === "top" ? "bottom" : "top";
      }

      let top =
        resolvedSide === "top"
          ? anchor.top - size.height - sideOffset
          : anchor.bottom + sideOffset;

      let left: number;
      if (align === "start") {
        left = anchor.left + alignOffset;
      } else if (align === "end") {
        left = anchor.right - size.width - alignOffset;
      } else {
        left = anchor.left + (anchor.width - size.width) / 2 + alignOffset;
      }

      const minTop = offsetTop + edgePadding;
      const maxTop = offsetTop + vh - size.height - edgePadding;
      const minLeft = offsetLeft + edgePadding;
      const maxLeft = offsetLeft + vw - size.width - edgePadding;

      top = Math.max(minTop, Math.min(top, maxTop));
      left = Math.max(minLeft, Math.min(left, maxLeft));

      setPosition({ top, left, side: resolvedSide, ready: true });
    };

    recompute();

    const raf = requestAnimationFrame(recompute);
    window.addEventListener("scroll", recompute, true);
    window.addEventListener("resize", recompute);
    window.visualViewport?.addEventListener("scroll", recompute);
    window.visualViewport?.addEventListener("resize", recompute);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", recompute, true);
      window.removeEventListener("resize", recompute);
      window.visualViewport?.removeEventListener("scroll", recompute);
      window.visualViewport?.removeEventListener("resize", recompute);
    };
  }, [open, range, side, align, sideOffset, alignOffset, edgePadding]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={ref}
      data-slot="selection-toolbar"
      data-side={position.side}
      data-align={align}
      role="toolbar"
      onMouseDown={(event) => {
        onMouseDown?.(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
      }}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        visibility: position.ready ? "visible" : "hidden",
        ...style,
      }}
      className={cn(
        "z-50 inline-flex items-center gap-0.5",
        "rounded-outer bg-surface ring ring-border shadow-lg",
        "p-1 text-sm text-foreground select-none",
        className,
      )}
      {...props}
    />,
    document.body,
  );
}

type SelectionButtonProps = Omit<React.ComponentProps<typeof Button>, "onSelect"> & {
  onSelect?: (text: string) => void;
  closeOnSelect?: boolean;
  clearOnSelect?: boolean;
};

export function SelectionButton({
  onSelect,
  onClick,
  closeOnSelect = true,
  clearOnSelect = true,
  variant = "ghost",
  className,
  ...props
}: SelectionButtonProps) {
  const { text, dismiss, clearSelection } = useSelectionContext();
  return (
    <Button
      data-slot="selection-button"
      variant={variant}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onSelect?.(text);
        if (clearOnSelect) {
          clearSelection();
        } else if (closeOnSelect) {
          dismiss();
        }
      }}
      className={cn("h-7 px-2 text-xs", className)}
      {...props}
    />
  );
}

export function SelectionSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="selection-separator"
      aria-hidden
      className={cn("mx-0.5 h-4 w-px bg-border", className)}
      {...props}
    />
  );
}
