import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils";

type ComposerContextValue = {
  rootId: string;
  isEmpty: boolean;
  isFocused: boolean;
  disabled: boolean;
  setEmpty: (b: boolean) => void;
  setFocused: (b: boolean) => void;
  registerSubmit: (fn: () => void) => () => void;
  triggerSubmit: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export const ComposerContext = createContext<ComposerContextValue | null>(null);

type ComposerExtensionContextValue = {
  state: unknown;
  setState: (s: unknown) => void;
};

export const ComposerExtensionContext =
  createContext<ComposerExtensionContextValue | null>(null);

export function useComposerContext() {
  const ctx = useContext(ComposerContext);
  if (!ctx) {
    throw new Error("Composer parts must be used inside <Composer>");
  }
  return ctx;
}

export function useComposerExtensionContext() {
  const ctx = useContext(ComposerExtensionContext);
  if (!ctx) {
    throw new Error("Composer parts must be used inside <Composer>");
  }
  return ctx;
}

export function useComposer() {
  const ctx = useComposerContext();
  return {
    isEmpty: ctx.isEmpty,
    isFocused: ctx.isFocused,
    disabled: ctx.disabled,
    submit: ctx.triggerSubmit,
  };
}

export function Composer({
  disabled = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  disabled?: boolean;
}) {
  const rootId = useId();
  const [isEmpty, setIsEmpty] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [extState, setExtState] = useState<unknown>(null);
  const submitFnRef = useRef<(() => void) | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const registerSubmit = useCallback((fn: () => void) => {
    submitFnRef.current = fn;
    return () => {
      if (submitFnRef.current === fn) submitFnRef.current = null;
    };
  }, []);

  const triggerSubmit = useCallback(() => {
    submitFnRef.current?.();
  }, []);

  const ctxValue = useMemo<ComposerContextValue>(
    () => ({
      rootId,
      isEmpty,
      isFocused,
      disabled,
      setEmpty: setIsEmpty,
      setFocused: setIsFocused,
      registerSubmit,
      triggerSubmit,
      containerRef,
    }),
    [rootId, isEmpty, isFocused, disabled, registerSubmit, triggerSubmit],
  );

  const extCtxValue = useMemo<ComposerExtensionContextValue>(
    () => ({ state: extState, setState: setExtState }),
    [extState],
  );

  return (
    <ComposerContext.Provider value={ctxValue}>
      <ComposerExtensionContext.Provider value={extCtxValue}>
        <div
          ref={containerRef}
          data-slot="composer"
          data-empty={isEmpty ? "true" : "false"}
          data-focus={isFocused ? "true" : "false"}
          data-disabled={disabled ? "true" : undefined}
          aria-disabled={disabled || undefined}
          className={cn(
            "relative flex flex-col gap-1 rounded-outer border border-border bg-surface p-2",
            "focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/60",
            "transition-[box-shadow,border-color]",
            "data-[disabled=true]:opacity-60 data-[disabled=true]:cursor-not-allowed",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </ComposerExtensionContext.Provider>
    </ComposerContext.Provider>
  );
}

function autosize(el: HTMLTextAreaElement, maxRows: number) {
  el.style.height = "auto";
  const styles = window.getComputedStyle(el);
  const lineHeight = parseFloat(styles.lineHeight) || 20;
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  const paddingBottom = parseFloat(styles.paddingBottom) || 0;
  const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;
  const next = Math.min(el.scrollHeight, maxHeight);
  el.style.height = `${next}px`;
  el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
}

export function ComposerInput({
  onSubmit,
  onValueChange,
  defaultValue = "",
  placeholder,
  autoFocus = false,
  maxRows = 8,
  submitOnEnter = true,
  className,
  ...props
}: Omit<React.ComponentProps<"textarea">, "onSubmit" | "onChange" | "rows"> & {
  onSubmit?: (text: string) => void;
  onValueChange?: (text: string) => void;
  defaultValue?: string;
  autoFocus?: boolean;
  maxRows?: number;
  submitOnEnter?: boolean;
}) {
  const ctx = useComposerContext();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const isComposingRef = useRef(false);

  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  const doSubmit = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const text = el.value;
    if (!text.trim()) return;
    onSubmitRef.current?.(text);
    el.value = "";
    ctx.setEmpty(true);
    autosize(el, maxRows);
    onValueChangeRef.current?.("");
  }, [ctx, maxRows]);

  useEffect(() => ctx.registerSubmit(doSubmit), [ctx, doSubmit]);

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.value = defaultValue;
    ctx.setEmpty(defaultValue.trim().length === 0);
    autosize(el, maxRows);
    if (autoFocus && !ctx.disabled) el.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    ctx.setEmpty(el.value.trim().length === 0);
    autosize(el, maxRows);
    onValueChangeRef.current?.(el.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing || isComposingRef.current) return;
    if (submitOnEnter && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      doSubmit();
    }
  };

  return (
    <textarea
      ref={inputRef}
      data-slot="composer-input"
      placeholder={placeholder}
      disabled={ctx.disabled}
      rows={1}
      onInput={onInput}
      onKeyDown={onKeyDown}
      onFocus={() => ctx.setFocused(true)}
      onBlur={() => ctx.setFocused(false)}
      onCompositionStart={() => {
        isComposingRef.current = true;
      }}
      onCompositionEnd={() => {
        isComposingRef.current = false;
      }}
      className={cn(
        "w-full resize-none outline-none bg-transparent",
        "min-h-9 px-2 py-1.5 text-sm leading-relaxed text-foreground",
        "placeholder:text-muted-foreground",
        "disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
}

export function ComposerToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-toolbar"
      className={cn("flex items-center gap-1.5 px-1 pt-1", className)}
      {...props}
    />
  );
}

export function ComposerToolbarSpacer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-toolbar-spacer"
      className={cn("ml-auto flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

export function ComposerSubmit({
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  const ctx = useComposerContext();
  const blocked = ctx.isEmpty || ctx.disabled;
  const ariaLabel =
    (props as { "aria-label"?: string })["aria-label"] ?? "Send";

  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "composer-submit",
      "data-empty": ctx.isEmpty || undefined,
      "aria-label": ariaLabel,
      disabled: blocked,
      onClick: () => ctx.triggerSubmit(),
    },
  });
}
