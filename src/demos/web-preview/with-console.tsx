import {
  CircleAlert,
  Info,
  Monitor,
  RotateCw,
  Smartphone,
  Tablet,
  Terminal,
  TriangleAlert,
  Wifi,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import { cn } from "#/lib/utils";
import {
  type Viewport,
  WebPreview,
  WebPreviewAddress,
  WebPreviewContent,
  WebPreviewHeader,
  WebPreviewPanel,
  WebPreviewPanels,
  WebPreviewPanelTrigger,
  WebPreviewReload,
  useWebPreview,
} from "#/components/ai/web-preview";

const presets: Viewport[] = [null, 768, 375];
const icons = [Monitor, Tablet, Smartphone];
const labels = ["Fit", "Tablet", "Mobile"];

function ViewportCycle() {
  const { viewport, setViewport } = useWebPreview();
  const matched = presets.findIndex((p) => p === viewport);
  const index = matched >= 0 ? matched : 0;
  const Icon = icons[index];
  const next = () => setViewport(presets[(index + 1) % presets.length]);

  return (
    <Button
      iconOnly
      variant="ghost"
      onClick={next}
      aria-label={`Switch viewport (current: ${labels[index]})`}
      className="text-muted-foreground hover:text-foreground"
    >
      <Icon />
    </Button>
  );
}

const logs = [
  { level: "info", message: "GET / 200 OK" },
  { level: "info", message: "Hydration complete" },
  { level: "warn", message: "Deprecated API: legacy-router" },
  { level: "info", message: "Mounted <App /> in 124ms" },
  { level: "error", message: "TypeError: cannot read property 'id' of null" },
  { level: "info", message: "Render committed" },
];

const levelStyles = {
  info: "text-muted-foreground",
  warn: "text-amber-500",
  error: "text-red-500",
} as const;

const levelIcons = {
  info: Info,
  warn: TriangleAlert,
  error: CircleAlert,
} as const;

const requests = [
  { method: "GET", path: "/", status: 200, ms: 86 },
  { method: "GET", path: "/_app/main.js", status: 200, ms: 142 },
  { method: "GET", path: "/_app/style.css", status: 200, ms: 58 },
  { method: "GET", path: "/api/session", status: 401, ms: 41 },
  { method: "POST", path: "/api/track", status: 204, ms: 27 },
];

export default function WithConsole() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <WebPreview defaultUrl="https://selia.earth">
        <WebPreviewHeader>
          <div className="w-1/3 mx-auto flex justify-center items-center gap-1.5">
            <WebPreviewReload
              render={
                <Button
                  iconOnly
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                />
              }
            >
              <RotateCw />
            </WebPreviewReload>
            <WebPreviewAddress />
            <ViewportCycle />
          </div>
        </WebPreviewHeader>
        <WebPreviewContent className="h-96" />
        <div className="flex items-center gap-1 px-3.5 py-1.5 mt-1.5">
          <WebPreviewPanelTrigger
            panelId="console"
            render={
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-xs px-2.5 h-7 data-active:bg-accent data-active:text-foreground"
              />
            }
          >
            <Terminal />
            Console
          </WebPreviewPanelTrigger>
          <WebPreviewPanelTrigger
            panelId="network"
            render={
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-xs px-2.5 h-7 data-active:bg-accent data-active:text-foreground"
              />
            }
          >
            <Wifi />
            Network
          </WebPreviewPanelTrigger>
        </div>
        <WebPreviewPanels>
          <WebPreviewPanel id="console">
            <ul className="divide-y divide-border font-mono text-xs">
              {logs.map((log, i) => {
                const Icon = levelIcons[log.level as keyof typeof levelIcons];
                return (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 px-3.5 py-1.5"
                  >
                    <Icon
                      className={cn(
                        "size-3.5 shrink-0",
                        levelStyles[log.level as keyof typeof levelStyles],
                      )}
                    />
                    <span className="text-foreground/80">{log.message}</span>
                  </li>
                );
              })}
            </ul>
          </WebPreviewPanel>
          <WebPreviewPanel id="network">
            <ul className="divide-y divide-border font-mono text-xs">
              {requests.map((req, i) => (
                <li key={i} className="flex items-center gap-3 px-3.5 py-1.5">
                  <span className="w-12 text-muted-foreground">
                    {req.method}
                  </span>
                  <span className="flex-1 truncate text-foreground/80">
                    {req.path}
                  </span>
                  <span
                    className={cn(
                      "w-10 tabular-nums",
                      req.status >= 400
                        ? "text-red-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {req.status}
                  </span>
                  <span className="w-12 text-right text-muted-foreground tabular-nums">
                    {req.ms}ms
                  </span>
                </li>
              ))}
            </ul>
          </WebPreviewPanel>
        </WebPreviewPanels>
      </WebPreview>
    </div>
  );
}
