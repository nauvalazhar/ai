"use client";

import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const modelSelectorVariants = cva("flex flex-col gap-0.5 p-1", {
  variants: {
    variant: {
      default: "rounded-outer bg-surface ring ring-border",
      plain: "",
    },
  },
  defaultVariants: { variant: "default" },
});

type ModelSelectorProps = Omit<
  React.ComponentProps<typeof BaseAutocomplete.Root>,
  "inline"
> &
  VariantProps<typeof modelSelectorVariants> & {
    className?: string;
  };

export function ModelSelector({
  variant,
  className,
  children,
  autoHighlight = "always",
  ...props
}: ModelSelectorProps) {
  return (
    <BaseAutocomplete.Root inline open autoHighlight={autoHighlight} {...props}>
      <div
        data-slot="model-selector"
        data-variant={variant ?? "default"}
        className={cn(modelSelectorVariants({ variant }), className)}
      >
        {children}
      </div>
    </BaseAutocomplete.Root>
  );
}

export function ModelSelectorInput({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Input>) {
  return (
    <BaseAutocomplete.Input
      data-slot="model-selector-input"
      className={cn(
        "w-full bg-transparent px-3 py-2 text-sm outline-none h-9.5",
        "text-foreground placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ModelSelectorList({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.List>) {
  return (
    <BaseAutocomplete.List
      data-slot="model-selector-list"
      className={cn(
        "flex max-h-72 flex-col gap-0.5 overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

export function ModelSelectorEmpty({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Empty>) {
  return (
    <BaseAutocomplete.Empty
      data-slot="model-selector-empty"
      className={cn(
        "px-3 py-2 text-sm text-muted-foreground empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

export function ModelSelectorGroup({
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Group>) {
  return <BaseAutocomplete.Group data-slot="model-selector-group" {...props} />;
}

export function ModelSelectorGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.GroupLabel>) {
  return (
    <BaseAutocomplete.GroupLabel
      data-slot="model-selector-group-label"
      className={cn("px-3 pt-2 pb-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export const ModelSelectorCollection = BaseAutocomplete.Collection;

export function ModelSelectorSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Separator>) {
  return (
    <BaseAutocomplete.Separator
      data-slot="model-selector-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export function ModelSelectorItem({
  className,
  ...props
}: React.ComponentProps<typeof BaseAutocomplete.Item>) {
  return (
    <BaseAutocomplete.Item
      data-slot="model-selector-item"
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded px-3 py-2 text-sm text-foreground select-none",
        "transition-colors duration-150",
        "data-highlighted:bg-accent",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function ModelSelectorItemIcon({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="model-selector-item-icon"
      className={cn(
        "inline-flex shrink-0 items-center text-muted-foreground",
        "[&>svg]:size-4 [&>img]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function ModelSelectorItemText({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="model-selector-item-text"
      className={cn("min-w-0 flex-1 truncate", className)}
      {...props}
    />
  );
}

export function ModelSelectorItemMeta({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="model-selector-item-meta"
      className={cn(
        "ml-auto shrink-0 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
