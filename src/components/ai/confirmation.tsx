import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { createContext, useContext, useState } from "react";
import { cn } from "#/lib/utils";

type ConfirmationState = "pending" | "approved" | "rejected";

type ConfirmationContextValue = {
  state: ConfirmationState;
  accept: () => void;
  reject: () => void;
};

const ConfirmationContext = createContext<ConfirmationContextValue | null>(
  null,
);

function useConfirmationContext() {
  const ctx = useContext(ConfirmationContext);
  if (!ctx) {
    throw new Error("Confirmation parts must be used inside <Confirmation>");
  }
  return ctx;
}

export const confirmationVariants = cva(
  "group/confirmation flex flex-col rounded-outer bg-surface p-1 ring",
  {
    variants: {
      tone: {
        default: "ring-border",
        danger: "ring-destructive/40",
      },
    },
    defaultVariants: { tone: "default" },
  },
);

type ConfirmationProps = Omit<React.ComponentProps<"div">, "onChange"> &
  VariantProps<typeof confirmationVariants> & {
    state?: ConfirmationState;
    defaultState?: ConfirmationState;
    onStateChange?: (state: ConfirmationState) => void;
  };

export function Confirmation({
  state: stateProp,
  defaultState = "pending",
  onStateChange,
  tone,
  className,
  ...props
}: ConfirmationProps) {
  const [internalState, setInternalState] =
    useState<ConfirmationState>(defaultState);
  const isControlled = stateProp !== undefined;
  const state = isControlled ? stateProp : internalState;

  const setState = (next: ConfirmationState) => {
    if (!isControlled) setInternalState(next);
    onStateChange?.(next);
  };

  return (
    <ConfirmationContext.Provider
      value={{
        state,
        accept: () => setState("approved"),
        reject: () => setState("rejected"),
      }}
    >
      <div
        data-slot="confirmation"
        data-state={state}
        data-tone={tone ?? "default"}
        className={cn(confirmationVariants({ tone, className }))}
        {...props}
      />
    </ConfirmationContext.Provider>
  );
}

export function ConfirmationHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-header"
      className={cn("flex items-center gap-2 px-3.5 pt-2.5 pb-2.5", className)}
      {...props}
    />
  );
}

export function ConfirmationIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="confirmation-icon"
      aria-hidden
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center",
        "text-muted-foreground",
        "in-data-[tone=danger]:text-destructive",
        "[&>svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function ConfirmationTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-title"
      className={cn(
        "min-w-0 flex-1 text-sm font-medium text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ConfirmationDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-description"
      className={cn("px-3.5 pb-2.5 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export function ConfirmationContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-content"
      className={cn("px-3.5 pb-2.5", className)}
      {...props}
    />
  );
}

export function ConfirmationPending({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-pending"
      className={cn(
        "hidden group-data-[state=pending]/confirmation:block",
        className,
      )}
      {...props}
    />
  );
}

export function ConfirmationApproved({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-approved"
      className={cn(
        "hidden group-data-[state=approved]/confirmation:block",
        className,
      )}
      {...props}
    />
  );
}

export function ConfirmationRejected({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-rejected"
      className={cn(
        "hidden group-data-[state=rejected]/confirmation:block",
        className,
      )}
      {...props}
    />
  );
}

export function ConfirmationAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-action"
      className={cn(
        "flex items-center justify-end gap-2 px-3.5 pt-1 pb-2.5",
        className,
      )}
      {...props}
    />
  );
}

export function ConfirmationAccept({
  render,
  onClick: userOnClick,
  ...props
}: useRender.ComponentProps<"button">) {
  const ctx = useConfirmationContext();
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "confirmation-accept",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        userOnClick?.(event);
        if (!event.defaultPrevented) ctx.accept();
      },
    },
  });
}

export function ConfirmationReject({
  render,
  onClick: userOnClick,
  ...props
}: useRender.ComponentProps<"button">) {
  const ctx = useConfirmationContext();
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "confirmation-reject",
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        userOnClick?.(event);
        if (!event.defaultPrevented) ctx.reject();
      },
    },
  });
}

export function ConfirmationStatus({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="confirmation-status"
      className={cn(
        "flex items-center gap-2 px-3.5 pt-1 pb-2.5 text-sm text-muted-foreground",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}
