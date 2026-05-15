"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "#/lib/utils";

export function Menu({ ...props }: React.ComponentProps<typeof BaseMenu.Root>) {
  return <BaseMenu.Root data-slot="menu" {...props} />;
}

export function MenuTrigger({
  ...props
}: React.ComponentProps<typeof BaseMenu.Trigger>) {
  return <BaseMenu.Trigger data-slot="menu-trigger" {...props} />;
}

const menuPopupClassName = [
  "origin-(--transform-origin) bg-surface-elevated ring ring-border rounded-outer shadow-lg",
  "p-1 outline-none transition-[transform,scale,opacity]",
  "data-[ending-style]:opacity-0 data-[ending-style]:scale-90",
  "data-[starting-style]:opacity-0 data-[starting-style]:scale-90",
  "**:data-[slot=item]:p-0 min-w-56 text-sm",
  "**:data-[slot$=item]:gap-2.5",
  "**:data-[slot$=item]:px-3",
  "**:data-[slot$=item]:py-1.5",
  "**:data-[slot=menu-checkbox-item]:pl-9",
  "**:data-[slot=menu-checkbox-item]:data-[checked]:pl-2.5",
  "**:data-[slot$=item]:rounded",
  "**:data-[slot=menu-submenu-trigger]:gap-2.5",
  "**:data-[slot=menu-submenu-trigger]:px-3",
  "**:data-[slot=menu-submenu-trigger]:py-1.5",
  "**:data-[slot=menu-submenu-trigger]:rounded",
];

export function MenuPopup({
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
}: React.ComponentProps<typeof BaseMenu.Popup> & {
  align?: BaseMenu.Positioner.Props["align"];
  alignOffset?: BaseMenu.Positioner.Props["alignOffset"];
  side?: BaseMenu.Positioner.Props["side"];
  sideOffset?: BaseMenu.Positioner.Props["sideOffset"];
  anchor?: BaseMenu.Positioner.Props["anchor"];
  sticky?: BaseMenu.Positioner.Props["sticky"];
  positionMethod?: BaseMenu.Positioner.Props["positionMethod"];
}) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Backdrop />
      <BaseMenu.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset || 6}
        anchor={anchor}
        sticky={sticky}
        positionMethod={positionMethod}
      >
        <BaseMenu.Popup
          data-slot="menu-popup"
          {...props}
          className={cn(menuPopupClassName, className)}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

const menuItemClassName = [
  "flex items-center text-foreground",
  "cursor-pointer select-none",
  "data-[highlighted]:not-[[data-disabled]]:bg-accent data-[selected]:not-[[data-disabled]]:bg-accent",
  "data-[popup-open]:bg-accent",
  "focus-visible:outline-none transition-colors duration-150",
  "[&_svg:not([class*=size-])]:size-3.5 [&_svg:not([class*=text-])]:text-foreground",
  "*:data-[slot=switch]:ml-auto",
  "data-disabled:cursor-not-allowed data-disabled:opacity-70",
];

export function MenuItem({
  ...props
}: React.ComponentProps<typeof BaseMenu.Item>) {
  return (
    <BaseMenu.Item
      data-slot="menu-item"
      {...props}
      className={cn(menuItemClassName, props.className)}
    />
  );
}

export function MenuSeparator({
  ...props
}: React.ComponentProps<typeof BaseMenu.Separator>) {
  return (
    <BaseMenu.Separator
      data-slot="menu-separator"
      className={cn("h-px my-1 bg-border", props.className)}
      {...props}
    />
  );
}

export function MenuSubmenu({
  ...props
}: React.ComponentProps<typeof BaseMenu.SubmenuRoot>) {
  return <BaseMenu.SubmenuRoot data-slot="menu-submenu" {...props} />;
}

export function MenuSubmenuTrigger({
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.SubmenuTrigger>) {
  return (
    <BaseMenu.SubmenuTrigger
      data-slot="menu-submenu-trigger"
      {...props}
      className={cn(menuItemClassName, props.className)}
    >
      {children}
      <ChevronRightIcon className="size-4 ml-auto" />
    </BaseMenu.SubmenuTrigger>
  );
}

export function MenuSubmenuPopup({
  align,
  alignOffset,
  side,
  sideOffset = 5,
  anchor,
  sticky,
  positionMethod,
  ...props
}: React.ComponentProps<typeof BaseMenu.Popup> & {
  align?: BaseMenu.Positioner.Props["align"];
  alignOffset?: BaseMenu.Positioner.Props["alignOffset"];
  side?: BaseMenu.Positioner.Props["side"];
  sideOffset?: BaseMenu.Positioner.Props["sideOffset"];
  anchor?: BaseMenu.Positioner.Props["anchor"];
  sticky?: BaseMenu.Positioner.Props["sticky"];
  positionMethod?: BaseMenu.Positioner.Props["positionMethod"];
}) {
  return (
    <MenuPopup
      data-slot="menu-sub-popup"
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      anchor={anchor}
      sticky={sticky}
      positionMethod={positionMethod}
      {...props}
    />
  );
}

export function MenuGroup({
  ...props
}: React.ComponentProps<typeof BaseMenu.Group>) {
  return <BaseMenu.Group data-slot="menu-group" {...props} />;
}

export function MenuGroupLabel({
  ...props
}: React.ComponentProps<typeof BaseMenu.GroupLabel>) {
  return (
    <BaseMenu.GroupLabel
      data-slot="menu-group-label"
      className={cn(
        "px-3 py-1.5 text-muted-foreground text-xs",
        props.className,
      )}
      {...props}
    />
  );
}

export function MenuCheckboxItem({
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem
      data-slot="menu-checkbox-item"
      {...props}
      className={cn(menuItemClassName, props.className)}
    >
      <BaseMenu.CheckboxItemIndicator className="w-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          className="size-4 text-primary"
          viewBox="0 0 24 24"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
      </BaseMenu.CheckboxItemIndicator>
      {children}
    </BaseMenu.CheckboxItem>
  );
}

export function MenuRadioGroup({
  ...props
}: React.ComponentProps<typeof BaseMenu.RadioGroup>) {
  return <BaseMenu.RadioGroup data-slot="menu-radio-group" {...props} />;
}

export const menuRadioItemVariants = cva(menuItemClassName, {
  variants: {
    variant: {
      default: "data-[checked]:pl-3",
      alternate: [
        "*:data-[slot=menu-radio-item-indicator]:order-last",
        "*:data-[slot=menu-radio-item-indicator]:ml-auto",
        "*:data-[slot=menu-radio-item-indicator]:ring",
        "*:data-[slot=menu-radio-item-indicator]:ring-border",
        "*:data-[slot=menu-radio-item-indicator]:bg-surface",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function MenuRadioItem({
  className,
  variant,
  children,
  ...props
}: React.ComponentProps<typeof BaseMenu.RadioItem> &
  VariantProps<typeof menuRadioItemVariants>) {
  return (
    <BaseMenu.RadioItem
      data-slot="menu-radio-item"
      {...props}
      className={menuRadioItemVariants({ variant, className })}
    >
      <div
        data-slot="menu-radio-item-indicator"
        className="flex items-center justify-center size-3 rounded-full"
      >
        <BaseMenu.RadioItemIndicator>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="fill-primary stroke-primary w-2! mx-auto"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        </BaseMenu.RadioItemIndicator>
      </div>
      {children}
    </BaseMenu.RadioItem>
  );
}
