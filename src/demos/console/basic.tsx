import { useEffect, useState } from "react";
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

type LogEntry = {
  id: number;
  level: ConsoleLevel;
  time: string;
  message: string;
  source?: string;
  stack?: string;
};

const seed: LogEntry[] = [
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
    message: "Hydration complete in 124ms",
  },
  {
    id: 2,
    level: "debug",
    time: "12:04:32",
    message: "Mounted <App /> with 6 children",
    source: "app.tsx:18",
  },
  {
    id: 3,
    level: "warn",
    time: "12:04:33",
    message: "Deprecated API: legacy-router will be removed in v4",
    source: "router.ts:104",
  },
  {
    id: 4,
    level: "error",
    time: "12:04:34",
    message: "TypeError: Cannot read property 'id' of null",
    source: "user-card.tsx:27",
    stack: `at UserCard (user-card.tsx:27:18)
at Profile (profile.tsx:12:5)
at Suspense (react-dom.js:1043:9)
at App (app.tsx:18:3)`,
  },
];

const stream: Omit<LogEntry, "id" | "time">[] = [
  { level: "info", message: "POST /api/track 204 No Content" },
  { level: "log", message: "Render committed (8ms)" },
  { level: "info", message: "GET /api/feed 200 OK" },
  { level: "debug", message: "Cache hit: feed:user:42" },
  { level: "warn", message: "Slow query: 312ms" },
  { level: "info", message: "Mutation: createPost ok" },
  { level: "log", message: "Render committed (4ms)" },
];

function now() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export default function Basic() {
  const [entries, setEntries] = useState<LogEntry[]>(seed);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const next = stream[i % stream.length];
      setEntries((prev) => [
        ...prev,
        { id: prev.length, time: now(), ...next },
      ]);
      i += 1;
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="p-1 bg-surface rounded-outer ring ring-border">
        <Console className="h-96 py-1 rounded bg-surface-elevated ring ring-border overflow-hidden">
          <ConsoleContent>
            <ConsoleList>
              {entries.map((entry) => (
                <ConsoleEntry key={entry.id} level={entry.level}>
                  <ConsoleTimestamp>{entry.time}</ConsoleTimestamp>
                  {entry.stack ? (
                    <ConsoleStack>
                      <ConsoleStackTrigger>{entry.message}</ConsoleStackTrigger>
                      <ConsoleStackContent>{entry.stack}</ConsoleStackContent>
                    </ConsoleStack>
                  ) : (
                    <span className="min-w-0 flex-1 truncate">
                      {entry.message}
                    </span>
                  )}
                  {entry.source ? (
                    <ConsoleSource>{entry.source}</ConsoleSource>
                  ) : null}
                </ConsoleEntry>
              ))}
            </ConsoleList>
          </ConsoleContent>
        </Console>
      </div>
    </div>
  );
}
