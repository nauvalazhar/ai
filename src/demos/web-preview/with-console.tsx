import AnsiImport from "ansi-to-react";

const Ansi =
  (AnsiImport as unknown as { default?: typeof AnsiImport }).default ??
  AnsiImport;
import { Monitor, RotateCw, Smartphone, Tablet, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "#/components/ai/button";
import {
  Console,
  ConsoleContent,
  ConsoleEntry,
  ConsoleList,
  ConsoleSource,
  ConsoleStack,
  ConsoleStackContent,
  ConsoleStackTrigger,
  ConsoleTimestamp,
  type ConsoleLevel,
} from "#/components/ai/console";
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

type LogEntry = {
  id: number;
  level: ConsoleLevel;
  time: string;
  message: string;
  source?: string;
  stack?: string;
};

const seedLogs: LogEntry[] = [
  {
    id: 0,
    level: "info",
    time: "12:04:31",
    message: "GET / 200 OK",
    source: "server.ts:42",
  },
  {
    id: 1,
    level: "log",
    time: "12:04:31",
    message: "Hydration complete",
  },
  {
    id: 2,
    level: "warn",
    time: "12:04:32",
    message: "Deprecated API: legacy-router",
    source: "router.ts:104",
  },
  {
    id: 3,
    level: "log",
    time: "12:04:32",
    message: "Mounted <App /> in 124ms",
  },
  {
    id: 4,
    level: "error",
    time: "12:04:33",
    message: "TypeError: cannot read property 'id' of null",
    source: "user-card.tsx:27",
    stack: `at UserCard (user-card.tsx:27:18)
at Profile (profile.tsx:12:5)
at App (app.tsx:18:3)`,
  },
  {
    id: 5,
    level: "info",
    time: "12:04:34",
    message: "Render committed",
  },
];

const streamLogs: Omit<LogEntry, "id" | "time">[] = [
  { level: "debug", message: "Cache hit: feed:user:42" },
  { level: "info", message: "POST /api/track 204 No Content" },
  { level: "log", message: "Render committed (4ms)" },
  { level: "warn", message: "Slow query: 312ms" },
];

function now() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

const terminalOutput = `[32;1m  VITE[22m v8.0.10[39m  [2mready in[22m [1m1299[22m [2mms[22m[39m

  [32m➜[39m  [1mLocal:[22m   [36mhttp://localhost:3300/[39m
  [32m➜[39m  [1mNetwork:[22m [2muse --host to expose[22m
  [32m➜[39m  [2mpress[22m [1mh + enter[22m [2mto show help.[22m`;

export default function WithConsole() {
  const [logs, setLogs] = useState<LogEntry[]>(seedLogs);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const next = streamLogs[i % streamLogs.length];
      setLogs((prev) => [...prev, { id: prev.length, time: now(), ...next }]);
      i += 1;
    }, 2200);
    return () => clearInterval(id);
  }, []);

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
            panelId="terminal"
            render={
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground text-xs px-2.5 h-7 data-active:bg-accent data-active:text-foreground"
              />
            }
          >
            <Terminal />
            Terminal
          </WebPreviewPanelTrigger>
        </div>
        <WebPreviewPanels>
          <WebPreviewPanel
            id="console"
            className="max-h-72 overflow-hidden p-0"
          >
            <Console className="h-72">
              <ConsoleContent>
                <ConsoleList>
                  {logs.map((log) => (
                    <ConsoleEntry key={log.id} level={log.level}>
                      <ConsoleTimestamp>{log.time}</ConsoleTimestamp>
                      {log.stack ? (
                        <ConsoleStack>
                          <ConsoleStackTrigger>
                            {log.message}
                          </ConsoleStackTrigger>
                          <ConsoleStackContent>{log.stack}</ConsoleStackContent>
                        </ConsoleStack>
                      ) : (
                        <span className="min-w-0 flex-1 truncate">
                          {log.message}
                        </span>
                      )}
                      {log.source ? (
                        <ConsoleSource>{log.source}</ConsoleSource>
                      ) : null}
                    </ConsoleEntry>
                  ))}
                </ConsoleList>
              </ConsoleContent>
            </Console>
          </WebPreviewPanel>
          <WebPreviewPanel id="terminal">
            <div className="whitespace-pre font-mono text-xs py-2">
              <Ansi>{terminalOutput}</Ansi>
            </div>
          </WebPreviewPanel>
        </WebPreviewPanels>
      </WebPreview>
    </div>
  );
}
