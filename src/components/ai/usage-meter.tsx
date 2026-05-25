import { Meter } from "@base-ui/react/meter";
import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";
import { cn } from "#/lib/utils";

const usageMeterVariants = cva(
  cn(
    "group/meter inline-flex flex-wrap items-center text-foreground",
    "[&_[data-slot=usage-bar]]:flex-1",
  ),
  {
    variants: {
      size: {
        default: "gap-x-4 gap-y-2 text-sm",
        sm: "gap-x-3 gap-y-1.5 text-xs",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type UsageMeterProps = React.ComponentProps<"div"> &
  VariantProps<typeof usageMeterVariants>;

export function UsageMeter({
  size = "default",
  className,
  ...props
}: UsageMeterProps) {
  return (
    <div
      data-slot="usage-meter"
      data-size={size}
      className={cn(usageMeterVariants({ size, className }))}
      {...props}
    />
  );
}

export function UsageStat({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="usage-stat"
      className={cn("inline-flex items-baseline gap-1.5", className)}
      {...props}
    />
  );
}

export function UsageStatLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="usage-stat-label"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

export function UsageStatValue({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="usage-stat-value"
      className={cn("font-medium text-foreground tabular-nums", className)}
      {...props}
    />
  );
}

type AnimatedNumberProps = Omit<React.ComponentProps<"span">, "children"> & {
  value: number;
  duration?: number;
  format?: (value: number) => React.ReactNode;
};

export function AnimatedNumber({
  value,
  duration = 300,
  format = (n) => Math.round(n).toLocaleString(),
  className,
  ...props
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const displayRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (to - from) * eased;
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      fromRef.current = displayRef.current;
    };
  }, [value, duration]);

  return (
    <span
      data-slot="animated-number"
      className={cn("tabular-nums", className)}
      {...props}
    >
      {format(display)}
    </span>
  );
}

type UsageBarProps = Omit<Meter.Root.Props, "value"> & {
  value: number;
  max: number;
};

export function UsageBar({
  value,
  max,
  className,
  children,
  ...props
}: UsageBarProps) {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const over = clamped / safeMax >= 0.8;

  return (
    <Meter.Root
      data-slot="usage-bar"
      data-state={over ? "over" : "under"}
      value={value}
      max={safeMax}
      className={cn("group/bar flex min-w-32 flex-col gap-1", className)}
      {...props}
    >
      {children ? (
        <div className="flex items-baseline justify-between gap-2 text-muted-foreground">
          {children}
        </div>
      ) : null}
      <Meter.Track
        data-slot="usage-bar-track"
        className={cn(
          "h-2 w-full overflow-hidden rounded-full bg-muted",
          "group-data-[size=sm]/meter:h-1",
        )}
      >
        <Meter.Indicator
          data-slot="usage-bar-fill"
          className={cn(
            "rounded-full transition-[width,background-color] duration-200 ease-out",
            "bg-primary group-data-[state=over]/bar:bg-destructive",
          )}
        />
      </Meter.Track>
    </Meter.Root>
  );
}
