import { useEffect, useState } from "react";
import {
  CheckCircle2Icon,
  FilePenLineIcon,
  LightbulbIcon,
  SearchIcon,
  TerminalIcon,
} from "lucide-react";
import { Chip } from "#/components/ai/chip";
import { Loader } from "#/components/ai/loader";
import {
  Task,
  TaskIcon,
  TaskItem,
  TaskLabel,
} from "#/components/ai/task";

type Step = {
  icon: React.ReactNode;
  label: string;
  target?: string;
};

const STEPS: Step[] = [
  { icon: <LightbulbIcon />, label: "Thought for 4s" },
  { icon: <SearchIcon />, label: "Searched", target: "components/ai" },
  { icon: <FilePenLineIcon />, label: "Edited", target: "src/styles.css" },
  { icon: <FilePenLineIcon />, label: "Edited", target: "src/routes/index.tsx" },
  { icon: <TerminalIcon />, label: "Ran", target: "bun run typecheck" },
];

export default function Streaming() {
  const [shown, setShown] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (shown >= STEPS.length) {
      const id = window.setTimeout(() => setDone(true), 700);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setShown((n) => n + 1), 1100);
    return () => window.clearTimeout(id);
  }, [shown, done]);

  return (
    <div className="mx-auto max-w-2xl">
      <Task>
        {STEPS.slice(0, shown).map((step, i) => {
          const isCurrent = !done && i === shown - 1;
          return (
            <TaskItem key={`${step.label}-${i}`}>
              <TaskIcon>
                {isCurrent ? (
                  <span
                    aria-hidden
                    className="relative inline-flex size-2 rounded-full bg-inflight"
                  >
                    <span className="absolute inset-0 rounded-full bg-inflight opacity-75 animate-ping" />
                  </span>
                ) : i < shown - 1 || done ? (
                  <CheckCircle2Icon />
                ) : (
                  step.icon
                )}
              </TaskIcon>
              {isCurrent ? (
                <Loader variant="shimmer" className="text-foreground">
                  {step.label}
                </Loader>
              ) : (
                <TaskLabel>{step.label}</TaskLabel>
              )}
              {step.target && <Chip>{step.target}</Chip>}
            </TaskItem>
          );
        })}
      </Task>
    </div>
  );
}
