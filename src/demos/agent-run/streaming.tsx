import { useEffect, useRef, useState } from "react";
import {
  FileTextIcon,
  FolderTreeIcon,
  SearchIcon,
} from "lucide-react";
import {
  Action,
  ActionContent,
  ActionIcon,
  ActionLabel,
  ActionTrigger,
} from "#/components/ai/action";
import {
  AgentRun,
  AgentRunContent,
  AgentRunHeader,
  AgentRunMeta,
  AgentRunStatus,
  AgentRunStep,
  AgentRunText,
  AgentRunTitle,
} from "#/components/ai/agent-run";
import { Chip } from "#/components/ai/chip";

type Step =
  | { kind: "text"; body: React.ReactNode }
  | {
      kind: "action";
      icon: React.ReactNode;
      label: string;
      target: string;
      detail: string;
    };

const STEPS: Step[] = [
  {
    kind: "text",
    body: "Looking through the project to map out where components and demos live so the new file lands in the right folder.",
  },
  {
    kind: "action",
    icon: <FolderTreeIcon />,
    label: "List",
    target: "src/components/ai",
    detail: "Found 41 components grouped under one folder.",
  },
  {
    kind: "action",
    icon: <SearchIcon />,
    label: "Search",
    target: "data-slot",
    detail:
      "Every component sets a data-slot attribute on its root for CSS targeting.",
  },
  {
    kind: "text",
    body: "The naming for one of the components was unclear, so I pulled up the actual file.",
  },
  {
    kind: "action",
    icon: <FileTextIcon />,
    label: "Read",
    target: "CONVENTIONS.md",
    detail:
      "Components stay free of SDK types. Heavy renderers like Markdown are sibling components, not internals.",
  },
  {
    kind: "text",
    body: (
      <>
        Wrapping up. The kit follows a copy-paste model with one file per
        component family. New files land under{" "}
        <code>src/components/ai</code>.
      </>
    ),
  },
];

export default function Streaming() {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (done) return;
    if (shown >= STEPS.length) {
      const id = window.setTimeout(() => setDone(true), 600);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setShown((n) => n + 1), 1100);
    return () => window.clearTimeout(id);
  }, [shown, done]);

  useEffect(() => {
    if (done) return;
    if (startRef.current === null) startRef.current = performance.now();
    const id = window.setInterval(() => {
      if (startRef.current === null) return;
      setElapsed((performance.now() - startRef.current) / 1000);
    }, 100);
    return () => window.clearInterval(id);
  }, [done]);

  const state = done ? "completed" : "running";

  return (
    <div className="mx-auto max-w-2xl p-6">
      <AgentRun state={state} defaultOpen>
        <AgentRunHeader>
          <AgentRunTitle>
            {done ? "Explored codebase" : "Exploring codebase"}
          </AgentRunTitle>
          <AgentRunStatus />
          <AgentRunMeta>
            <span className="tabular-nums">
              {Math.min(shown, STEPS.length)} of {STEPS.length} steps
            </span>
            <span>·</span>
            <span className="tabular-nums">{elapsed.toFixed(1)}s</span>
          </AgentRunMeta>
        </AgentRunHeader>
        <AgentRunContent>
          {STEPS.slice(0, shown).map((step, i) => (
            <AgentRunStep key={i}>
              {step.kind === "text" ? (
                <AgentRunText>{step.body}</AgentRunText>
              ) : (
                <Action defaultOpen={false}>
                  <ActionTrigger>
                    <ActionIcon>{step.icon}</ActionIcon>
                    <ActionLabel>{step.label}</ActionLabel>
                    <Chip size="sm">{step.target}</Chip>
                  </ActionTrigger>
                  <ActionContent>{step.detail}</ActionContent>
                </Action>
              )}
            </AgentRunStep>
          ))}
        </AgentRunContent>
      </AgentRun>
    </div>
  );
}
