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
            "transition-[box-shadow,border-color] shadow-xs",
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
  value: valueProp,
  defaultValue,
  placeholder,
  autoFocus = false,
  maxRows = 8,
  submitOnEnter = true,
  className,
  ...props
}: Omit<
  React.ComponentProps<"textarea">,
  "onSubmit" | "onChange" | "rows" | "value" | "defaultValue"
> & {
  onSubmit?: (text: string) => void;
  onValueChange?: (text: string) => void;
  value?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  maxRows?: number;
  submitOnEnter?: boolean;
}) {
  const ctx = useComposerContext();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const isComposingRef = useRef(false);
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const value = isControlled ? valueProp : internalValue;
  const valueRef = useRef(value);
  valueRef.current = value;
  const isControlledRef = useRef(isControlled);
  isControlledRef.current = isControlled;

  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    ctx.setEmpty(value.trim().length === 0);
    autosize(el, maxRows);
  }, [value, maxRows, ctx]);

  useLayoutEffect(() => {
    if (autoFocus && !ctx.disabled) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doSubmit = useCallback(() => {
    const text = valueRef.current;
    if (!text.trim()) return;
    onSubmitRef.current?.(text);
    if (!isControlledRef.current) {
      setInternalValue("");
      onValueChangeRef.current?.("");
    }
  }, []);

  useEffect(() => ctx.registerSubmit(doSubmit), [ctx, doSubmit]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    if (!isControlled) setInternalValue(next);
    onValueChangeRef.current?.(next);
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
      value={value}
      onChange={onChange}
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

export function ComposerQuote({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="composer-quote"
      className={cn(
        "mx-1 mt-1 flex items-start gap-2 rounded bg-surface-elevated px-3 py-2 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ComposerQuoteIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="composer-quote-icon"
      aria-hidden
      className={cn(
        "mt-0.5 inline-flex shrink-0 items-center justify-center text-muted-foreground",
        "[&>svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function ComposerQuoteContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-slot="composer-quote-content"
      data-overflows={overflows || undefined}
      className={cn(
        "min-w-0 flex-1 overflow-hidden italic max-h-[3lh] whitespace-pre-wrap",
        "data-overflows:mask-[linear-gradient(to_bottom,black_55%,transparent)]",
        className,
      )}
      {...props}
    />
  );
}

export function ComposerQuoteDismiss({
  className,
  type,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type={type ?? "button"}
      data-slot="composer-quote-dismiss"
      className={cn(
        "shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-foreground",
        "[&>svg]:size-3.5",
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
  disabled: disabledProp,
  ...props
}: useRender.ComponentProps<"button">) {
  const ctx = useComposerContext();
  const blocked = ctx.isEmpty || ctx.disabled || !!disabledProp;
  const ariaLabel = props["aria-label"] ?? "Send";

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
