import {
  Children,
  Fragment,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils";

type OptionInfo = { value: string; isOther: boolean };
type StepInfo = { name: string; defaultValue?: string; options: OptionInfo[] };

type AnswerContext = {
  name: string;
  stepIndex: number;
  totalSteps: number;
  partial: Record<string, string>;
  isOther: boolean;
};

type PromptContextValue = {
  currentStepName: string | undefined;
  currentStepIndex: number;
  totalSteps: number;
  partial: Record<string, string>;

  optionIndexMap: Map<string, number>;
  otherIndex: number;

  highlightedIndex: number;
  setHighlightedIndex: (i: number) => void;
  otherValue: string;
  setOtherValue: (v: string) => void;
  otherInputRef: React.RefObject<HTMLInputElement | null>;

  submit: () => void;
  back: () => void;
  dismiss: () => void;
  canBack: boolean;
  submitOnClick: boolean;
};

const PromptContext = createContext<PromptContextValue | null>(null);

function usePromptContext() {
  const ctx = useContext(PromptContext);
  if (!ctx) {
    throw new Error("Prompt parts must be used inside <Prompt>");
  }
  return ctx;
}

export function usePrompt() {
  const ctx = usePromptContext();
  return {
    currentStep: ctx.currentStepName,
    stepIndex: ctx.currentStepIndex,
    totalSteps: ctx.totalSteps,
    partial: ctx.partial,
    submit: ctx.submit,
    back: ctx.back,
    dismiss: ctx.dismiss,
    canBack: ctx.canBack,
  };
}

function flattenChildren(children: React.ReactNode): React.ReactElement[] {
  const out: React.ReactElement[] = [];
  const walk = (node: React.ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;
      if (child.type === Fragment) {
        walk((child.props as { children?: React.ReactNode }).children);
        return;
      }
      out.push(child);
    });
  };
  walk(children);
  return out;
}

function extractStepOptions(stepChildren: React.ReactNode): OptionInfo[] {
  const list: OptionInfo[] = [];
  for (const child of flattenChildren(stepChildren)) {
    if (child.type === PromptOption) {
      const p = child.props as { value: string };
      list.push({ value: p.value, isOther: false });
    } else if (child.type === PromptOptionOther) {
      list.push({ value: "", isOther: true });
    }
  }
  return list;
}

function extractSteps(children: React.ReactNode): StepInfo[] {
  const list: StepInfo[] = [];
  for (const child of flattenChildren(children)) {
    if (child.type !== PromptStep) continue;
    const p = child.props as {
      name: string;
      defaultValue?: string;
      children: React.ReactNode;
    };
    list.push({
      name: p.name,
      defaultValue: p.defaultValue,
      options: extractStepOptions(p.children),
    });
  }
  return list;
}

type State = {
  stepIndex: number;
  partial: Record<string, string>;
  highlightedIndex: number;
  otherValue: string;
};

function resolveInitial(
  step: StepInfo | undefined,
  partial: Record<string, string>,
  defaultValues: Record<string, string>,
): { highlightedIndex: number; otherValue: string } {
  if (!step || step.options.length === 0) {
    return { highlightedIndex: -1, otherValue: "" };
  }

  const fromPartial = partial[step.name];
  if (fromPartial) {
    const match = step.options.findIndex(
      (o) => !o.isOther && o.value === fromPartial,
    );
    if (match >= 0) return { highlightedIndex: match, otherValue: "" };
    const other = step.options.findIndex((o) => o.isOther);
    if (other >= 0) return { highlightedIndex: other, otherValue: fromPartial };
  }

  const fromOuter = defaultValues[step.name];
  if (fromOuter) {
    const m = step.options.findIndex(
      (o) => !o.isOther && o.value === fromOuter,
    );
    if (m >= 0) return { highlightedIndex: m, otherValue: "" };
  }

  if (step.defaultValue) {
    const m = step.options.findIndex(
      (o) => !o.isOther && o.value === step.defaultValue,
    );
    if (m >= 0) return { highlightedIndex: m, otherValue: "" };
  }

  const firstNonOther = step.options.findIndex((o) => !o.isOther);
  return {
    highlightedIndex: firstNonOther >= 0 ? firstNonOther : 0,
    otherValue: "",
  };
}

type Action =
  | { type: "highlight"; index: number }
  | { type: "setOther"; value: string }
  | {
      type: "next";
      stepName: string;
      value: string;
      nextStep: StepInfo | undefined;
      defaultValues: Record<string, string>;
    }
  | {
      type: "back";
      prevStep: StepInfo | undefined;
      defaultValues: Record<string, string>;
    }
  | {
      type: "reset";
      firstStep: StepInfo | undefined;
      defaultValues: Record<string, string>;
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "highlight":
      return state.highlightedIndex === action.index
        ? state
        : { ...state, highlightedIndex: action.index };
    case "setOther":
      return state.otherValue === action.value
        ? state
        : { ...state, otherValue: action.value };
    case "next": {
      const partial = { ...state.partial, [action.stepName]: action.value };
      const init = resolveInitial(
        action.nextStep,
        partial,
        action.defaultValues,
      );
      return { stepIndex: state.stepIndex + 1, partial, ...init };
    }
    case "back": {
      const init = resolveInitial(
        action.prevStep,
        state.partial,
        action.defaultValues,
      );
      return {
        ...state,
        stepIndex: Math.max(0, state.stepIndex - 1),
        ...init,
      };
    }
    case "reset": {
      const init = resolveInitial(
        action.firstStep,
        action.defaultValues,
        action.defaultValues,
      );
      return { stepIndex: 0, partial: action.defaultValues, ...init };
    }
  }
}

export function Prompt({
  defaultValues,
  submitOnClick = false,
  onAnswer,
  onComplete,
  onDismiss,
  children,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onSubmit"> & {
  defaultValues?: Record<string, string>;
  submitOnClick?: boolean;
  onAnswer?: (value: string, ctx: AnswerContext) => void;
  onComplete?: (answers: Record<string, string>) => void;
  onDismiss?: () => void;
}) {
  const steps = extractSteps(children);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const defaultValuesRef = useRef<Record<string, string>>(defaultValues ?? {});
  defaultValuesRef.current = defaultValues ?? {};

  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const dv = defaultValues ?? {};
    return {
      stepIndex: 0,
      partial: dv,
      ...resolveInitial(steps[0], dv, dv),
    };
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const callbacksRef = useRef({ onAnswer, onComplete, onDismiss });
  callbacksRef.current = { onAnswer, onComplete, onDismiss };

  const otherInputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);

  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);

  const setHighlightedIndex = useCallback(
    (i: number) => dispatch({ type: "highlight", index: i }),
    [],
  );
  const setOtherValue = useCallback(
    (v: string) => dispatch({ type: "setOther", value: v }),
    [],
  );

  const submit = useCallback(() => {
    const s = stateRef.current;
    const all = stepsRef.current;
    const step = all[s.stepIndex];
    if (!step) return;
    const opt = step.options[s.highlightedIndex];
    if (!opt) return;

    let value: string;
    if (opt.isOther) {
      value = s.otherValue.trim();
      if (value.length === 0) return;
    } else {
      value = opt.value;
    }

    const nextPartial = { ...s.partial, [step.name]: value };
    callbacksRef.current.onAnswer?.(value, {
      name: step.name,
      stepIndex: s.stepIndex,
      totalSteps: all.length,
      partial: nextPartial,
      isOther: opt.isOther,
    });

    if (s.stepIndex === all.length - 1) {
      callbacksRef.current.onComplete?.(nextPartial);
      dispatch({
        type: "reset",
        firstStep: all[0],
        defaultValues: defaultValuesRef.current,
      });
    } else {
      dispatch({
        type: "next",
        stepName: step.name,
        value,
        nextStep: all[s.stepIndex + 1],
        defaultValues: defaultValuesRef.current,
      });
    }
  }, []);

  const back = useCallback(() => {
    const s = stateRef.current;
    if (s.stepIndex === 0) return;
    dispatch({
      type: "back",
      prevStep: stepsRef.current[s.stepIndex - 1],
      defaultValues: defaultValuesRef.current,
    });
  }, []);

  const dismiss = useCallback(() => {
    callbacksRef.current.onDismiss?.();
    dispatch({
      type: "reset",
      firstStep: stepsRef.current[0],
      defaultValues: defaultValuesRef.current,
    });
  }, []);

  useEffect(() => {
    const opts = stepsRef.current[state.stepIndex]?.options ?? [];
    const active = opts[state.highlightedIndex];
    if (active?.isOther) {
      otherInputRef.current?.focus();
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    if (
      document.activeElement === otherInputRef.current ||
      !root.contains(document.activeElement)
    ) {
      root.focus();
    }
  }, [state.highlightedIndex, state.stepIndex]);

  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => {
      setContentHeight(el.scrollHeight);
      if (!hasMeasured) {
        requestAnimationFrame(() => setHasMeasured(true));
      }
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [hasMeasured]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const inOtherInput = e.target === otherInputRef.current;
    const s = stateRef.current;
    const opts = stepsRef.current[s.stepIndex]?.options ?? [];

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (opts.length > 0) {
        setHighlightedIndex(Math.min(opts.length - 1, s.highlightedIndex + 1));
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (opts.length > 0) {
        setHighlightedIndex(Math.max(0, s.highlightedIndex - 1));
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      dismiss();
      return;
    }
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      back();
      return;
    }
    if (e.key === "ArrowLeft" && !inOtherInput) {
      e.preventDefault();
      back();
      return;
    }
    if (!inOtherInput && /^[1-9]$/.test(e.key)) {
      const idx = Number.parseInt(e.key, 10) - 1;
      if (idx < opts.length) {
        e.preventDefault();
        setHighlightedIndex(idx);
      }
    }
  };

  const currentStep = steps[state.stepIndex];
  const options = currentStep?.options ?? [];
  const otherIndex = options.findIndex((o) => o.isOther);
  const optionIndexMap = new Map<string, number>();
  options.forEach((o, i) => {
    if (!o.isOther) optionIndexMap.set(o.value, i);
  });

  const value: PromptContextValue = {
    currentStepName: currentStep?.name,
    currentStepIndex: state.stepIndex,
    totalSteps: steps.length,
    partial: state.partial,
    optionIndexMap,
    otherIndex,
    highlightedIndex: state.highlightedIndex,
    setHighlightedIndex,
    otherValue: state.otherValue,
    setOtherValue,
    otherInputRef,
    submit,
    back,
    dismiss,
    canBack: state.stepIndex > 0,
    submitOnClick,
  };

  return (
    <PromptContext.Provider value={value}>
      <div
        ref={rootRef}
        data-slot="prompt"
        data-step={currentStep?.name}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className={cn(
          "flex flex-col rounded-outer border border-border bg-surface p-1",
          "focus:outline-none",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "overflow-hidden",
            hasMeasured && "transition-[height] duration-200 ease-out",
          )}
          style={{
            height: contentHeight !== null ? `${contentHeight}px` : undefined,
          }}
        >
          <div ref={measureRef} className="flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </PromptContext.Provider>
  );
}

export function PromptStep({
  name,
  defaultValue: _defaultValue,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  defaultValue?: string;
}) {
  const ctx = usePromptContext();
  if (ctx.currentStepName !== name) return null;

  return (
    <div
      data-slot="prompt-step"
      data-step={name}
      className={cn("flex flex-col space-y-0.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function PromptQuestion({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prompt-question"
      className={cn("px-3.5 pt-2.5 pb-2.5 text-foreground text-sm", className)}
      {...props}
    />
  );
}

export function PromptOption({
  value,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"button">, "value"> & { value: string }) {
  const ctx = usePromptContext();
  const index = ctx.optionIndexMap.get(value) ?? -1;
  const isHighlighted = index >= 0 && ctx.highlightedIndex === index;

  return (
    <button
      type="button"
      data-slot="prompt-option"
      data-highlighted={isHighlighted ? "true" : "false"}
      onMouseEnter={() => {
        if (index >= 0) ctx.setHighlightedIndex(index);
      }}
      onClick={() => {
        if (index < 0) return;
        ctx.setHighlightedIndex(index);
        if (ctx.submitOnClick) ctx.submit();
      }}
      className={cn(
        "flex items-center gap-3 px-3.5 py-2 text-left cursor-pointer select-none",
        "rounded text-sm focus:outline-none",
        isHighlighted ? "bg-accent text-foreground" : "bg-transparent",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="w-4 tabular-nums text-muted-foreground">
        {index >= 0 ? `${index + 1}.` : ""}
      </span>
      <span className="flex-1">{children}</span>
    </button>
  );
}

export function PromptOptionOther({
  placeholder,
  className,
  ...props
}: React.ComponentProps<"div"> & { placeholder?: string }) {
  const ctx = usePromptContext();
  const index = ctx.otherIndex;
  const isHighlighted = index >= 0 && ctx.highlightedIndex === index;

  return (
    <div
      data-slot="prompt-option-other"
      data-highlighted={isHighlighted ? "true" : "false"}
      onMouseEnter={() => {
        if (index >= 0) ctx.setHighlightedIndex(index);
      }}
      onClick={() => {
        if (index < 0) return;
        ctx.setHighlightedIndex(index);
        ctx.otherInputRef.current?.focus();
      }}
      className={cn(
        "flex items-center gap-3 px-3.5 py-2 cursor-text select-none",
        "rounded text-sm focus:outline-none",
        isHighlighted ? "bg-accent text-foreground" : "bg-transparent",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="w-4 tabular-nums text-sm text-muted-foreground"
      >
        {index >= 0 ? `${index + 1}.` : ""}
      </span>
      <input
        ref={ctx.otherInputRef}
        type="text"
        value={ctx.otherValue}
        placeholder={placeholder ?? "Type your answer"}
        onChange={(e) => {
          ctx.setOtherValue(e.target.value);
          if (!isHighlighted && index >= 0) ctx.setHighlightedIndex(index);
        }}
        onFocus={() => {
          if (!isHighlighted && index >= 0) ctx.setHighlightedIndex(index);
        }}
        className={cn(
          "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
          isHighlighted ? "text-foreground" : "text-muted-foreground",
        )}
      />
    </div>
  );
}

export function PromptFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prompt-footer"
      className={cn(
        "flex items-center justify-end gap-3 px-3.5 py-2.5",
        className,
      )}
      {...props}
    />
  );
}

export function PromptHint({
  keys,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { keys?: string }) {
  return (
    <span
      data-slot="prompt-hint"
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {keys ? (
        <kbd
          className={cn(
            "rounded bg-surface-elevated px-1.5 py-0.5 font-sans text-xs text-foreground/80",
            "ring ring-border",
          )}
        >
          {keys}
        </kbd>
      ) : null}
    </span>
  );
}

export function PromptSubmit({
  render,
  onClick: userOnClick,
  ...props
}: useRender.ComponentProps<"button">) {
  const ctx = usePromptContext();
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "prompt-submit",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        userOnClick?.(event);
        if (!event.defaultPrevented) ctx.submit();
      },
    },
  });
}
