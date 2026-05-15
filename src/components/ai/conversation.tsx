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

type ConversationContextValue = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  isAtBottom: boolean;
  setIsAtBottom: (value: boolean) => void;
  wasAtBottomRef: React.RefObject<boolean>;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
};

const ConversationContext = createContext<ConversationContextValue | null>(
  null,
);

function useConversationContext() {
  const ctx = useContext(ConversationContext);
  if (!ctx) {
    throw new Error("Conversation parts must be used inside <Conversation>");
  }
  return ctx;
}

export function useConversation() {
  const { isAtBottom, scrollToBottom } = useConversationContext();
  return { isAtBottom, scrollToBottom };
}

export function Conversation({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const wasAtBottomRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const v = viewportRef.current;
    if (!v) return;
    v.scrollTo({ top: v.scrollHeight, behavior });
  }, []);

  const element = useRender({
    render,
    defaultTagName: "div",
    props: {
      ...props,
      "data-slot": "conversation",
      "data-at-bottom": isAtBottom ? "true" : "false",
      className: cn("relative overflow-hidden", className),
    },
  });

  return (
    <ConversationContext.Provider
      value={{
        viewportRef,
        isAtBottom,
        setIsAtBottom,
        wasAtBottomRef,
        scrollToBottom,
      }}
    >
      {element}
    </ConversationContext.Provider>
  );
}

export function ConversationContent({
  className,
  children,
  onScroll,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const { viewportRef, isAtBottom, setIsAtBottom, wasAtBottomRef } =
    useConversationContext();
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
      "data-slot": "conversation-content",
      "data-at-bottom": isAtBottom ? "true" : "false",
      onScroll: (event: React.UIEvent<HTMLDivElement>) => {
        recompute();
        onScroll?.(event);
      },
      className: cn(
        "overflow-y-auto overscroll-contain size-full",
        className,
      ),
      children: (
        <div ref={contentRef} className="flex flex-col gap-6">
          {children}
        </div>
      ),
    },
  });
}

export function ConversationScrollButton({
  render,
  onClick,
  ...props
}: useRender.ComponentProps<"button">) {
  const { isAtBottom, scrollToBottom } = useConversation();

  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "conversation-scroll-button",
      "data-at-bottom": isAtBottom ? "true" : "false",
      "aria-label": "Scroll to latest",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        scrollToBottom();
        onClick?.(event);
      },
    },
  });
}
