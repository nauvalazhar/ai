"use client";

import { useRender } from "@base-ui/react/use-render";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { cn } from "#/lib/utils";
import { formatTimestamp, usePlayer } from "./player";

type RegisteredItem = {
  id: string;
  start: number;
  end?: number;
};

type TranscriptContextValue = {
  activeId: string | null;
  autoScroll: boolean;
  setAutoScroll: (next: boolean) => void;
  registerItem: (item: RegisteredItem) => () => void;
};

const TranscriptContext = createContext<TranscriptContextValue | null>(null);

type ItemContextValue = {
  id: string;
  start: number;
  end?: number;
};

const ItemContext = createContext<ItemContextValue | null>(null);

function useTranscriptContext() {
  const ctx = use(TranscriptContext);
  if (!ctx) {
    throw new Error("Transcript parts must be rendered inside <Transcript>.");
  }
  return ctx;
}

function useItemContext() {
  const ctx = use(ItemContext);
  if (!ctx) {
    throw new Error(
      "TranscriptSpeaker, TranscriptText, TranscriptTime, and TranscriptWord must be rendered inside <TranscriptItem>.",
    );
  }
  return ctx;
}

export function useTranscript() {
  const { activeId, autoScroll, setAutoScroll } = useTranscriptContext();
  return { activeId, autoScroll, setAutoScroll };
}

type TranscriptProps = useRender.ComponentProps<"div"> & {
  defaultAutoScroll?: boolean;
};

export function Transcript({
  defaultAutoScroll = true,
  className,
  render,
  ...props
}: TranscriptProps) {
  const { currentTime } = usePlayer();
  const [autoScroll, setAutoScroll] = useState(defaultAutoScroll);
  const itemsRef = useRef<Map<string, RegisteredItem>>(new Map());
  const [itemsVersion, setItemsVersion] = useState(0);

  const registerItem = useCallback((item: RegisteredItem) => {
    itemsRef.current.set(item.id, item);
    setItemsVersion((v) => v + 1);
    return () => {
      itemsRef.current.delete(item.id);
      setItemsVersion((v) => v + 1);
    };
  }, []);

  const sortedItems = useMemo(
    () => Array.from(itemsRef.current.values()).sort((a, b) => a.start - b.start),
    [itemsVersion],
  );

  const activeId = useMemo(() => {
    if (sortedItems.length === 0) return null;
    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      const end =
        item.end ?? sortedItems[i + 1]?.start ?? Number.POSITIVE_INFINITY;
      if (currentTime >= item.start && currentTime < end) return item.id;
    }
    return null;
  }, [sortedItems, currentTime]);

  const value = useMemo<TranscriptContextValue>(
    () => ({ activeId, autoScroll, setAutoScroll, registerItem }),
    [activeId, autoScroll, registerItem],
  );

  const element = useRender({
    render,
    defaultTagName: "div",
    props: {
      ...props,
      "data-slot": "transcript",
      className: cn(
        "flex flex-col overflow-hidden rounded-outer bg-surface ring ring-border",
        className,
      ),
    },
  });

  return <TranscriptContext value={value}>{element}</TranscriptContext>;
}

export function TranscriptContent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    render,
    defaultTagName: "div",
    props: {
      ...props,
      "data-slot": "transcript-content",
      className: cn(
        "min-h-0 flex-1",
        render === undefined && "overflow-y-auto overscroll-contain",
        className,
      ),
    },
  });
}

export function TranscriptList({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="transcript-list"
      className={cn("flex flex-col gap-1 p-2", className)}
      {...props}
    />
  );
}

type TranscriptItemProps = useRender.ComponentProps<"div"> & {
  start: number;
  end?: number;
};

export function TranscriptItem({
  start,
  end,
  className,
  render,
  ...props
}: TranscriptItemProps) {
  const reactId = useId();
  const ctx = useTranscriptContext();
  const nodeRef = useRef<HTMLElement | null>(null);
  const active = ctx.activeId === reactId;

  useEffect(() => {
    return ctx.registerItem({ id: reactId, start, end });
  }, [reactId, start, end, ctx.registerItem]);

  useEffect(() => {
    if (!active || !ctx.autoScroll) return;
    nodeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active, ctx.autoScroll]);

  const itemValue = useMemo<ItemContextValue>(
    () => ({ id: reactId, start, end }),
    [reactId, start, end],
  );

  const element = useRender({
    render,
    defaultTagName: "div",
    ref: nodeRef,
    props: {
      ...props,
      "data-slot": "transcript-item",
      "data-active": active ? "" : undefined,
      className: cn(
        "flex gap-3 rounded p-2 transition-colors",
        "data-active:bg-surface-elevated",
        className,
      ),
    },
  });

  return <ItemContext value={itemValue}>{element}</ItemContext>;
}

export function TranscriptSpeaker({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="transcript-speaker"
      className={cn(
        "shrink-0 text-xs font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function TranscriptText({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="transcript-text"
      className={cn(
        "min-w-0 text-sm leading-relaxed text-muted-foreground",
        "in-data-active:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

type TranscriptWordProps = useRender.ComponentProps<"span"> & {
  start: number;
  end?: number;
};

export function TranscriptWord({
  start,
  end,
  className,
  render,
  ...props
}: TranscriptWordProps) {
  const { subscribeTime, getTime } = usePlayer();
  const played = useSyncExternalStore(
    subscribeTime,
    () => getTime() >= start,
    () => false,
  );
  const active = useSyncExternalStore(
    subscribeTime,
    () => {
      const t = getTime();
      return t >= start && (end == null || t < end);
    },
    () => false,
  );

  return useRender({
    render,
    defaultTagName: "span",
    props: {
      ...props,
      "data-slot": "transcript-word",
      "data-played": played ? "" : undefined,
      "data-active": active ? "" : undefined,
      className: cn(
        "text-muted-foreground transition-colors duration-75",
        "data-played:text-foreground",
        className,
      ),
    },
  });
}

type TranscriptTimeProps = useRender.ComponentProps<"button"> & {
  format?: (seconds: number, duration: number) => string;
};

export function TranscriptTime({
  format,
  onClick,
  render,
  className,
  ...props
}: TranscriptTimeProps) {
  const { duration, jumpTo } = usePlayer();
  const item = useItemContext();
  const text = (format ?? formatTimestamp)(item.start, duration);

  return useRender({
    render,
    defaultTagName: "button",
    props: {
      type: "button",
      ...props,
      "data-slot": "transcript-time",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        jumpTo(item.start);
      },
      className: cn(
        "shrink-0 cursor-pointer rounded font-mono text-xs tabular-nums text-muted-foreground",
        "hover:text-foreground transition-colors",
        "in-data-active:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      ),
      children: props.children ?? text,
    },
  });
}
