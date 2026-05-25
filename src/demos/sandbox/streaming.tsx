import { useEffect, useState } from "react";
import ShikiHighlighter from "#/lib/shiki";
import {
  Console,
  ConsoleContent,
  ConsoleEntry,
  ConsoleList,
  ConsoleTimestamp,
  type ConsoleLevel,
} from "#/components/ai/console";
import {
  Sandbox,
  SandboxContent,
  SandboxHeader,
  SandboxPanel,
  SandboxTab,
  SandboxTabs,
  SandboxTabsList,
  SandboxTitle,
  SandboxTrigger,
} from "#/components/ai/sandbox";
import { Status } from "#/components/ai/status";

const code = `for (const region of regions) {
  const { ok, ms } = await ping(region);
  console.log(\`\${region}: \${ok ? "ok" : "fail"} \${ms}ms\`);
}`;

type Log = { id: number; time: string; level: ConsoleLevel; message: string };

const stream: Omit<Log, "id" | "time">[] = [
  { level: "info", message: "starting health probe" },
  { level: "log", message: "us-east-1: ok 42ms" },
  { level: "log", message: "us-west-2: ok 71ms" },
  { level: "log", message: "eu-west-1: ok 108ms" },
  { level: "warn", message: "ap-south-1: slow 312ms" },
  { level: "log", message: "sa-east-1: ok 124ms" },
  { level: "info", message: "probe complete (5/5 ok)" },
];

function now() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export default function Streaming() {
  const [logs, setLogs] = useState<Log[]>([]);
  const done = logs.length >= stream.length;

  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { id: prev.length, time: now(), ...stream[prev.length] },
      ]);
    }, 700);
    return () => clearTimeout(id);
  }, [logs.length, done]);

  return (
    <div className="mx-auto max-w-2xl">
      <Sandbox state={done ? "success" : "running"} defaultOpen>
        <SandboxHeader>
          <SandboxTrigger>
            <SandboxTitle>probe.ts</SandboxTitle>
            <Status
              state={done ? "active" : "inflight"}
              size="sm"
              pulse={!done}
            >
              {done ? "success" : "running"}
            </Status>
          </SandboxTrigger>
        </SandboxHeader>
        <SandboxContent>
          <SandboxTabs defaultValue="output">
            <SandboxTabsList>
              <SandboxTab value="input">Input</SandboxTab>
              <SandboxTab value="output">Output</SandboxTab>
            </SandboxTabsList>
            <SandboxPanel value="input">
              <ShikiHighlighter
                language="ts"
                theme={{ light: "github-light", dark: "github-dark" }}
                defaultColor="light"
                addDefaultStyles={false}
                showLanguage={false}
                className="text-sm font-mono [&_pre]:bg-transparent! [&_pre]:outline-none!"
              >
                {code}
              </ShikiHighlighter>
            </SandboxPanel>
            <SandboxPanel value="output" className="p-0">
              <Console className="h-64">
                <ConsoleContent>
                  <ConsoleList>
                    {logs.map((log) => (
                      <ConsoleEntry key={log.id} level={log.level}>
                        <ConsoleTimestamp>{log.time}</ConsoleTimestamp>
                        <span className="min-w-0 flex-1">{log.message}</span>
                      </ConsoleEntry>
                    ))}
                  </ConsoleList>
                </ConsoleContent>
              </Console>
            </SandboxPanel>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    </div>
  );
}
