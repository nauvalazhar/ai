import { useRender } from "@base-ui/react/use-render";
import { createContext, useContext, useState } from "react";
import { cn } from "#/lib/utils";

type EnvContextValue = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const EnvContext = createContext<EnvContextValue | null>(null);

export function useEnv() {
  const ctx = useContext(EnvContext);
  if (!ctx) {
    throw new Error("useEnv must be used inside <Env>.");
  }
  return ctx;
}

type EnvProps = React.ComponentProps<"div"> & {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};

export function Env({
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  className,
  ...props
}: EnvProps) {
  const [visibleState, setVisibleState] = useState(defaultVisible);
  const isControlled = visibleProp !== undefined;
  const visible = isControlled ? visibleProp : visibleState;

  const setVisible = (next: boolean) => {
    if (!isControlled) setVisibleState(next);
    onVisibleChange?.(next);
  };

  return (
    <EnvContext.Provider value={{ visible, setVisible }}>
      <div
        data-slot="env"
        data-visible={visible || undefined}
        className={cn(
          "bg-surface rounded-outer ring ring-border flex flex-col gap-1",
          className,
        )}
        {...props}
      />
    </EnvContext.Provider>
  );
}

export function EnvHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="env-header"
      className={cn("px-4 h-11 flex items-center gap-2", className)}
      {...props}
    />
  );
}

export function EnvTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="env-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

export function EnvList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="env-list"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

type EnvVarContextValue = {
  value: string;
  secret: boolean;
};

const EnvVarContext = createContext<EnvVarContextValue | null>(null);

function useEnvVar() {
  const ctx = useContext(EnvVarContext);
  if (!ctx) {
    throw new Error("EnvVar parts must be rendered inside <EnvVar>.");
  }
  return ctx;
}

type EnvVarProps = React.ComponentProps<"div"> & {
  value: string;
  secret?: boolean;
};

export function EnvVar({
  value,
  secret = false,
  className,
  ...props
}: EnvVarProps) {
  return (
    <EnvVarContext.Provider value={{ value, secret }}>
      <div
        data-slot="env-var"
        data-secret={secret || undefined}
        className={cn(
          "group/env-var",
          "px-4 py-1.5 flex items-center gap-3 text-sm",
          className,
        )}
        {...props}
      />
    </EnvVarContext.Provider>
  );
}

export function EnvVarName({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="env-var-name"
      className={cn(
        "font-mono text-sm text-muted-foreground shrink-0",
        className,
      )}
      {...props}
    />
  );
}

const MASK = "••••••••";

export function EnvVarValue({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const { value, secret } = useEnvVar();
  const { visible } = useEnv();
  const masked = secret && !visible;

  return (
    <span
      data-slot="env-var-value"
      data-masked={masked || undefined}
      className={cn(
        "font-mono text-sm text-foreground min-w-0 ml-auto truncate",
        className,
      )}
      {...props}
    >
      {masked ? MASK : value}
    </span>
  );
}

export function EnvVarCopy({
  render,
  onClick,
  ...props
}: useRender.ComponentProps<"button">) {
  const { value } = useEnvVar();
  const [copied, setCopied] = useState(false);

  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "env-var-copy",
      "data-copied": copied || undefined,
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      },
    },
  });
}
