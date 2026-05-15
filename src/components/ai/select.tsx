"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";
import { Chip } from "./chip";

export type SelectItem = {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
};

export function Select({
  ...props
}: React.ComponentProps<typeof BaseSelect.Root>) {
  return <BaseSelect.Root {...props} />;
}

export const selectTriggerVariants = cva(
  [
    "h-7.5 px-3 w-full rounded text-sm text-foreground placeholder:text-muted-foreground transition-[color,box-shadow]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
    "flex items-center gap-1.5 cursor-pointer",
    "[&>svg]:size-3.5 [&>svg]:shrink-0 transition-colors duration-150",
    "data-disabled:cursor-not-allowed data-disabled:opacity-70",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-surface ring ring-border hover:not-[[data-disabled]]:not-[:focus-visible]:bg-accent shadow-sm",
        subtle: "bg-surface/60 ring ring-border shadow-sm",
        plain: "bg-transparent hover:not-[[data-disabled]]:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function SelectTrigger({
  className,
  children,
  variant,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger> &
  VariantProps<typeof selectTriggerVariants>) {
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={cn(selectTriggerVariants({ variant, className }))}
      {...props}
    >
      {children}

      <BaseSelect.Icon className="ml-auto size-3.5 text-muted-foreground pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export function SelectValue({
  className,
  placeholder = "Select an option",
  ...props
}: React.ComponentProps<typeof BaseSelect.Value> & {
  placeholder?: string;
}) {
  return (
    <BaseSelect.Value
      data-slot="select-value"
      className={cn(className)}
      {...props}
    >
      {(value: string | SelectItem | null) => (
        <SelectRenderValue value={value} placeholder={placeholder} />
      )}
    </BaseSelect.Value>
  );
}

function SelectRenderValue({
  value,
  placeholder,
}: {
  value: string | SelectItem | SelectItem[] | null;
  placeholder: string;
}) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return <span className="text-muted-foreground">{placeholder}</span>;
  }

  if (Array.isArray(value)) {
    const firstValue = value[0];
    const firstValueLabel =
      typeof firstValue === "object" ? firstValue.label : firstValue;
    const additionalValues =
      value.length > 1 ? (
        <Chip className="ml-1.5" size="sm">
          +{value.length - 1} more
        </Chip>
      ) : (
        ""
      );

    return (
      <>
        {firstValueLabel}
        {additionalValues}
      </>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="flex items-center gap-1.5 select-none [&_svg:not([class*=size-])]:size-3.5">
        {value.icon}
        <span>{value.label}</span>
      </div>
    );
  }

  return <span className="select-none">{value}</span>;
}

export function SelectPopup({
  children,
  className,
  align,
  alignOffset,
  side,
  sideOffset,
  anchor,
  sticky,
  positionMethod,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup> &
  VariantProps<typeof selectTriggerVariants> & {
    align?: BaseSelect.Positioner.Props["align"];
    alignOffset?: BaseSelect.Positioner.Props["alignOffset"];
    side?: BaseSelect.Positioner.Props["side"];
    sideOffset?: BaseSelect.Positioner.Props["sideOffset"];
    anchor?: BaseSelect.Positioner.Props["anchor"];
    sticky?: BaseSelect.Positioner.Props["sticky"];
    positionMethod?: BaseSelect.Positioner.Props["positionMethod"];
  }) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Backdrop />
      <BaseSelect.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset || 6}
        anchor={anchor}
        sticky={sticky}
        positionMethod={positionMethod}
      >
        <BaseSelect.ScrollUpArrow className="top-1 left-1 right-1 z-10 absolute rounded h-5 text-xs text-foreground flex items-center justify-around bg-accent" />
        <BaseSelect.Popup
          data-slot="select-popup"
          {...props}
          className={cn(
            "group origin-(--transform-origin) bg-surface-elevated ring ring-border rounded-outer shadow-lg",
            "p-1 outline-none max-lg:w-(--anchor-width) text-sm",
            "transition-[transform,scale,opacity]",
            "data-ending-style:opacity-0 data-ending-style:scale-90",
            "data-starting-style:opacity-0 data-starting-style:scale-90",
            className,
          )}
        >
          <BaseSelect.Arrow />
          {children}
        </BaseSelect.Popup>
        <BaseSelect.ScrollDownArrow className="bottom-1 left-1 right-1 z-10 absolute rounded h-5 text-xs text-foreground flex items-center justify-around bg-accent" />
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectList({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.List>) {
  return (
    <BaseSelect.List
      data-slot="select-list"
      className={cn(
        "max-h-(--available-height) overflow-y-auto relative",
        className,
      )}
      {...props}
    />
  );
}

export function SelectItem({
  className,
  children,
  value,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      value={typeof value === "object" ? value : { value, label: children }}
      className={cn(
        "flex items-center text-foreground py-1.5 px-3 gap-2.5 rounded select-none cursor-pointer",
        "group-data-[side=none]:min-w-[calc(var(--anchor-width))]",
        "data-highlighted:not-[data-disabled]:bg-accent data-selected:not-[data-disabled]:bg-accent",
        "[&_svg:not([class*=size-])]:size-3.5 [&_svg:not([class*=text-])]:text-foreground",
        "focus-visible:outline-none transition-colors duration-150",
        "data-disabled:cursor-not-allowed data-disabled:opacity-70",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText className="flex items-center gap-2.5">
        {children}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="ml-auto">
        <svg
          className="size-3.5 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

export function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Group>) {
  return (
    <BaseSelect.Group
      data-slot="select-group"
      className={cn(className)}
      {...props}
    />
  );
}

export function SelectGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      data-slot="select-group-label"
      className={cn("px-3 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BaseSelect.Separator>) {
  return (
    <BaseSelect.Separator
      data-slot="select-separator"
      className={cn("h-px my-1 bg-border", className)}
      {...props}
    />
  );
}
