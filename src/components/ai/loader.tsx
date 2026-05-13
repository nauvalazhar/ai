import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const loaderVariants = cva(
  "inline-flex items-baseline text-muted-foreground",
  {
    variants: {
      variant: {
        pulse:
          "animate-[text-pulse_var(--loader-duration,1.4s)_ease-in-out_infinite_both]",
        shimmer:
          "bg-clip-text [-webkit-text-fill-color:transparent] bg-[linear-gradient(90deg,color-mix(in_oklch,currentColor_40%,transparent)_0%,color-mix(in_oklch,currentColor_40%,transparent)_calc(50%_-_var(--loader-spread,40%)/2),currentColor_50%,color-mix(in_oklch,currentColor_40%,transparent)_calc(50%_+_var(--loader-spread,40%)/2),color-mix(in_oklch,currentColor_40%,transparent)_100%)] bg-size-[200%_100%] animate-[text-shimmer_var(--loader-duration,2.2s)_linear_infinite]",
      },
    },
  },
);

type LoaderProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof loaderVariants> & {
    dots?: boolean;
    duration?: number;
    spread?: number;
  };

export function Loader({
  variant,
  dots = false,
  duration,
  spread,
  className,
  children,
  render,
  style,
  ...props
}: LoaderProps) {
  const label = typeof children === "string" ? children : "Loading";

  const cssVars: React.CSSProperties = {};
  if (duration !== undefined) {
    (cssVars as Record<string, string>)["--loader-duration"] = `${duration}s`;
  }
  if (spread !== undefined) {
    (cssVars as Record<string, string>)["--loader-spread"] = `${spread}%`;
  }

  return useRender({
    render,
    defaultTagName: "span",
    props: {
      role: "status",
      "aria-label": label,
      ...props,
      "data-slot": "loader",
      "data-variant": variant,
      "data-dots": dots ? "" : undefined,
      style: { ...cssVars, ...style },
      className: cn(loaderVariants({ variant, className })),
      children: (
        <>
          {children}
          {dots && (
            <span
              aria-hidden
              className="ml-0.5 inline-flex [-webkit-text-fill-color:currentColor]"
            >
              <span className="animate-[loading-dot_var(--loader-duration,1.4s)_ease-in-out_infinite_both]">
                .
              </span>
              <span className="animate-[loading-dot_var(--loader-duration,1.4s)_ease-in-out_infinite_both] [animation-delay:calc(var(--loader-duration,1.4s)*0.14)]">
                .
              </span>
              <span className="animate-[loading-dot_var(--loader-duration,1.4s)_ease-in-out_infinite_both] [animation-delay:calc(var(--loader-duration,1.4s)*0.28)]">
                .
              </span>
            </span>
          )}
        </>
      ),
    },
  });
}
