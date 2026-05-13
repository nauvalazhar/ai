import { useEffect, useState } from "react";
import { Monitor, RefreshCw, Smartphone, Tablet } from "lucide-react";
import { cn } from "#/lib/utils";
import { Button } from "../ai/button";

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTH: Record<Viewport, number | null> = {
  desktop: null,
  tablet: 768,
  mobile: 390,
};

const VIEWPORT_NEXT: Record<Viewport, Viewport> = {
  desktop: "mobile",
  tablet: "desktop",
  mobile: "tablet",
};

const VIEWPORT_ICON: Record<Viewport, typeof Monitor> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};

export function PreviewView({ src, title }: { src: string; title: string }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewport, setViewport] = useState<Viewport>("desktop");

  function refresh() {
    setRefreshKey((k) => k + 1);
  }

  function cycleViewport() {
    setViewport((v) => VIEWPORT_NEXT[v]);
  }

  useEffect(() => {
    setViewport("desktop");
  }, [src]);

  const width = VIEWPORT_WIDTH[viewport];
  const ViewportIcon = VIEWPORT_ICON[viewport];
  const isConstrained = width !== null;

  return (
    <div className="flex flex-col h-full min-h-0 relative">
      <div className="hidden md:flex items-center gap-2 absolute w-72 z-10 top-3 left-1/2 -translate-x-1/2">
        <div className="flex-1 min-w-0 flex items-center gap-2 pr-3 pl-1.5 h-9.5 rounded ring ring-site-border bg-background/60 backdrop-blur-xs">
          <Button
            iconOnly
            variant="ghost"
            onClick={cycleViewport}
            aria-label={`Viewport: ${viewport}. Click to switch.`}
            className="text-muted-foreground hover:text-foreground"
          >
            <ViewportIcon className="size-3.5" />
          </Button>
          <span className="truncate text-xs text-muted-foreground">
            {title}
          </span>
          <Button
            iconOnly
            variant="ghost"
            onClick={refresh}
            aria-label="Refresh preview"
            className="-mr-1.5 ml-auto text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex justify-center">
        <div
          className={cn(
            "relative h-full transition-all duration-300",
            isConstrained && "ring ring-site-border/50",
          )}
          style={{ width: width ?? "100%" }}
        >
          <iframe
            key={refreshKey}
            src={src}
            title={title}
            className="size-full"
          />
        </div>
      </div>
    </div>
  );
}
