import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/lib/utils";

export const generatedImageVariants = cva(
  cn(
    "relative w-full overflow-hidden rounded-outer bg-surface-elevated text-foreground",
    "ring ring-border",
    "[&_[data-slot=generated-image-content]]:absolute",
    "[&_[data-slot=generated-image-content]]:inset-0",
    "[&_[data-slot=generated-image-content]]:size-full",
    "[&_[data-slot=generated-image-content]]:object-cover",
    "[&_[data-slot=generated-image-content]]:transition-opacity",
    "[&_[data-slot=generated-image-content]]:duration-500",
    "[&[data-state=generating]_[data-slot=generated-image-content]]:opacity-0",
    "[&[data-state=error]_[data-slot=generated-image-content]]:opacity-30",
  ),
  {
    variants: {
      aspectRatio: {
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
        auto: "",
      },
    },
    defaultVariants: { aspectRatio: "square" },
  },
);

type GeneratedImageProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof generatedImageVariants> & {
    state?: "generating" | "ready" | "error";
  };

export function GeneratedImage({
  state = "ready",
  aspectRatio,
  className,
  render,
  ...props
}: GeneratedImageProps) {
  return useRender({
    render,
    defaultTagName: "div",
    props: {
      ...props,
      "data-slot": "generated-image",
      "data-state": state,
      className: cn(generatedImageVariants({ aspectRatio, className })),
    },
  });
}

export function GeneratedImageTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="generated-image-title"
      className={cn(
        "absolute top-4 left-5 z-10 text-sm font-medium text-white",
        className,
      )}
      {...props}
    />
  );
}

export const generatedImageOverlayVariants = cva(
  cn(
    "pointer-events-none absolute inset-x-0 transition-opacity duration-300",
    "in-data-[state=generating]:opacity-0",
    "in-data-[state=generating]:transition-none",
  ),
  {
    variants: {
      position: {
        top: "top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent",
        bottom: "bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent",
        both: "inset-y-0 bg-gradient-to-b from-black/60 via-transparent to-black/60",
      },
    },
    defaultVariants: { position: "top" },
  },
);

type GeneratedImageOverlayProps = React.ComponentProps<"div"> &
  VariantProps<typeof generatedImageOverlayVariants>;

export function GeneratedImageOverlay({
  position,
  className,
  ...props
}: GeneratedImageOverlayProps) {
  return (
    <div
      data-slot="generated-image-overlay"
      aria-hidden
      className={cn(generatedImageOverlayVariants({ position, className }))}
      {...props}
    />
  );
}

export const generatedImageActionVariants = cva(
  cn(
    "absolute z-10 inline-flex items-center gap-1 transition-opacity duration-300",
    "in-data-[state=generating]:pointer-events-none",
    "in-data-[state=generating]:opacity-0",
    "in-data-[state=generating]:transition-none",
    "[&_[data-slot=button]]:text-white",
    "[&_[data-slot=button]:hover]:bg-white/15",
  ),
  {
    variants: {
      position: {
        "top-left": "top-3 left-3",
        "top-right": "top-3 right-3",
        "bottom-left": "bottom-3 left-3",
        "bottom-right": "bottom-3 right-3",
      },
    },
    defaultVariants: { position: "top-right" },
  },
);

type GeneratedImageActionProps = React.ComponentProps<"div"> &
  VariantProps<typeof generatedImageActionVariants>;

export function GeneratedImageAction({
  position,
  className,
  ...props
}: GeneratedImageActionProps) {
  return (
    <div
      data-slot="generated-image-action"
      className={cn(generatedImageActionVariants({ position, className }))}
      {...props}
    />
  );
}

export function GeneratedImageLoading({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="generated-image-loading"
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-300",
        "in-data-[state=ready]:opacity-0",
        "in-data-[state=error]:opacity-0",
        "in-data-[state=generating]:transition-none",
        "bg-[oklch(0.2_0_0)]",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="absolute inset-0 animate-[generated-image-pulse_2.8s_ease-in-out_infinite]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(1 0 0 / 0.22) 1.3px, transparent 1.7px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, black 10%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 10%, transparent 78%)",
        }}
      />
    </div>
  );
}
