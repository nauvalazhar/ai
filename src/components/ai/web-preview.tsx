import { Collapsible } from "@base-ui/react/collapsible";
import { useRender } from "@base-ui/react/use-render";
import { createContext, useContext, useState } from "react";
import { cn } from "#/lib/utils";

export type Viewport = number | null;

type WebPreviewContextValue = {
  url: string;
  setUrl: (url: string) => void;
  reloadKey: number;
  reload: () => void;
  viewport: Viewport;
  setViewport: (next: Viewport) => void;
  activePanel: string | null;
  displayedPanel: string | null;
  setActivePanel: (next: string | null) => void;
};

const WebPreviewContext = createContext<WebPreviewContextValue | null>(null);

export function useWebPreview() {
  const ctx = useContext(WebPreviewContext);
  if (!ctx) {
    throw new Error("useWebPreview must be used inside <WebPreview>.");
  }
  return ctx;
}

function normalize(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  if (/^[a-z][a-z0-9+\-.]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

type WebPreviewProps = React.ComponentProps<"div"> & {
  url?: string;
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
  viewport?: Viewport;
  defaultViewport?: Viewport;
  onViewportChange?: (viewport: Viewport) => void;
  panel?: string | null;
  defaultPanel?: string | null;
  onPanelChange?: (panel: string | null) => void;
};

export function WebPreview({
  url: urlProp,
  defaultUrl = "",
  onUrlChange,
  viewport: viewportProp,
  defaultViewport = null,
  onViewportChange,
  panel: panelProp,
  defaultPanel = null,
  onPanelChange,
  className,
  ...props
}: WebPreviewProps) {
  const [urlState, setUrlState] = useState(defaultUrl);
  const [viewportState, setViewportState] = useState<Viewport>(defaultViewport);
  const [panelState, setPanelState] = useState<string | null>(defaultPanel);
  const [displayedPanel, setDisplayedPanel] = useState<string | null>(
    panelProp ?? defaultPanel,
  );
  const [reloadKey, setReloadKey] = useState(0);

  const urlControlled = urlProp !== undefined;
  const url = urlControlled ? urlProp : urlState;

  const viewportControlled = viewportProp !== undefined;
  const viewport = viewportControlled ? viewportProp : viewportState;

  const panelControlled = panelProp !== undefined;
  const activePanel = panelControlled ? panelProp : panelState;

  if (activePanel !== null && activePanel !== displayedPanel) {
    setDisplayedPanel(activePanel);
  }

  const setUrl = (next: string) => {
    if (!urlControlled) setUrlState(next);
    onUrlChange?.(next);
  };

  const setViewport = (next: Viewport) => {
    if (!viewportControlled) setViewportState(next);
    onViewportChange?.(next);
  };

  const setActivePanel = (next: string | null) => {
    if (!panelControlled) setPanelState(next);
    onPanelChange?.(next);
  };

  const reload = () => setReloadKey((k) => k + 1);

  return (
    <WebPreviewContext.Provider
      value={{
        url,
        setUrl,
        reloadKey,
        reload,
        viewport,
        setViewport,
        activePanel,
        displayedPanel,
        setActivePanel,
      }}
    >
      <div
        data-slot="web-preview"
        className={cn(
          "flex flex-col rounded-outer bg-surface ring ring-border p-1",
          className,
        )}
        {...props}
      />
    </WebPreviewContext.Provider>
  );
}

export function WebPreviewHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="web-preview-header"
      className={cn(
        "flex items-center gap-1.5 px-3.5 py-1.5 mb-1.5",
        className,
      )}
      {...props}
    />
  );
}

export function WebPreviewReload({
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  const { reload, url } = useWebPreview();
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "web-preview-reload",
      disabled: !url,
      "aria-label": "Reload",
      onClick: reload,
    },
  });
}

export function WebPreviewOpen({
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  const { url } = useWebPreview();
  return useRender({
    render,
    defaultTagName: "a",
    props: {
      ...props,
      "data-slot": "web-preview-open",
      "aria-label": "Open in new tab",
      href: url || undefined,
      target: "_blank",
      rel: "noreferrer noopener",
    },
  });
}

type WebPreviewAddressProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
>;

export function WebPreviewAddress({
  className,
  onKeyDown,
  ...props
}: WebPreviewAddressProps) {
  const { url, setUrl } = useWebPreview();
  const [draft, setDraft] = useState(url);
  const [focused, setFocused] = useState(false);

  return (
    <input
      type="url"
      data-slot="web-preview-address"
      value={focused ? draft : url}
      placeholder="Enter a URL"
      onFocus={(e) => {
        setDraft(url);
        setFocused(true);
        e.currentTarget.select();
      }}
      onBlur={() => setFocused(false)}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const next = normalize(draft);
          setDraft(next);
          setUrl(next);
          e.currentTarget.blur();
        }
        if (e.key === "Escape") {
          setDraft(url);
          e.currentTarget.blur();
        }
        onKeyDown?.(e);
      }}
      className={cn(
        "min-w-0 h-7.5 px-3 text-sm rounded bg-surface-elevated",
        "border border-border text-foreground/80",
        "focus:outline-none focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/60",
        "truncate transition-all duration-150",
        className,
      )}
      {...props}
    />
  );
}

type WebPreviewContentProps = React.ComponentProps<"iframe"> & {
  fallback?: React.ReactNode;
};

export function WebPreviewContent({
  className,
  fallback,
  ...props
}: WebPreviewContentProps) {
  const { url, reloadKey, viewport } = useWebPreview();

  if (!url) {
    return (
      <div
        data-slot="web-preview-empty"
        className={cn(
          "grid place-items-center h-96 bg-surface-elevated ring ring-border rounded",
          "text-xs text-muted-foreground",
          className,
        )}
      >
        {fallback ?? "Enter a URL to preview"}
      </div>
    );
  }

  const constrained = viewport !== null;

  return (
    <div
      data-slot="web-preview-canvas"
      data-constrained={constrained || undefined}
      className={cn(
        "relative h-96 bg-surface-elevated ring ring-border rounded overflow-hidden",
        "flex items-center justify-center",
        className,
      )}
    >
      <iframe
        key={`${url}-${reloadKey}`}
        src={url}
        data-slot="web-preview-content"
        title="Web preview"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        className="transition-all duration-500 ease-out w-full h-full"
        style={{ width: viewport ?? undefined }}
        {...props}
      />
    </div>
  );
}

type WebPreviewPanelTriggerProps = useRender.ComponentProps<"button"> & {
  panelId: string;
};

export function WebPreviewPanelTrigger({
  render,
  panelId,
  ...props
}: WebPreviewPanelTriggerProps) {
  const { activePanel, setActivePanel } = useWebPreview();
  const active = activePanel === panelId;

  return useRender({
    render,
    defaultTagName: "button",
    props: {
      ...props,
      type: "button",
      "data-slot": "web-preview-panel-trigger",
      "data-panel-id": panelId,
      "data-active": active || undefined,
      "aria-pressed": active,
      onClick: () => setActivePanel(active ? null : panelId),
    },
  });
}

export function WebPreviewPanels({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible.Panel>) {
  const { activePanel, setActivePanel } = useWebPreview();
  const open = activePanel !== null;

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) setActivePanel(null);
      }}
      className="contents"
    >
      <Collapsible.Panel
        data-slot="web-preview-panels"
        className={cn(
          "overflow-hidden",
          "transition-[height] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "h-(--collapsible-panel-height) data-starting-style:h-0 data-ending-style:h-0",
          className,
        )}
        {...props}
      >
        <div>{children}</div>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

type WebPreviewPanelProps = React.ComponentProps<"div"> & {
  id: string;
};

export function WebPreviewPanel({
  id,
  className,
  ...props
}: WebPreviewPanelProps) {
  const { displayedPanel } = useWebPreview();
  if (displayedPanel !== id) return null;

  return (
    <div
      data-slot="web-preview-panel"
      data-panel-id={id}
      className={cn("max-h-72 overflow-auto", className)}
      {...props}
    />
  );
}
