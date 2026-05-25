import { useEffect, useState } from "react";
import { CheckCircle2Icon } from "lucide-react";
import { Loader } from "#/components/ai/loader";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtIcon,
  ChainOfThoughtStep,
  ChainOfThoughtStepContent,
  ChainOfThoughtStepTrigger,
} from "#/components/ai/chain-of-thought";

const STEPS = [
  {
    label: "Reading the project layout",
    detail:
      "There is an ai folder under components and a parallel folder for demos. New components fit into both.",
  },
  {
    label: "Inspecting an existing component",
    detail:
      "Reasoning is the closest pattern. It uses a collapsible with a chevron and a height transition.",
  },
  {
    label: "Drafting the new structure",
    detail:
      "An outer collapsible holds the list. Each step is its own inner collapsible, so the user can expand them independently.",
  },
];

export default function Streaming() {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (shown >= STEPS.length) {
      const id = window.setTimeout(() => setDone(true), 800);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setShown((n) => n + 1), 1500);
    return () => window.clearTimeout(id);
  }, [shown, done]);

  return (
    <div className="mx-auto max-w-2xl">
      <ChainOfThought defaultOpen>
        <ChainOfThoughtHeader>
          <ChainOfThoughtIcon />
          {done ? (
            "Worked through the request"
          ) : (
            <Loader variant="shimmer" className="text-foreground">
              Working through the request
            </Loader>
          )}
        </ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          {STEPS.slice(0, shown).map((step, i) => {
            const isCurrent = !done && i === shown - 1;
            return (
              <ChainOfThoughtStep key={step.label} defaultOpen={isCurrent}>
                <ChainOfThoughtStepTrigger>
                  <ChainOfThoughtIcon className="size-4.5">
                    {isCurrent ? (
                      <span
                        aria-hidden
                        className="relative inline-flex size-2 rounded-full bg-inflight"
                      >
                        <span className="absolute inset-0 rounded-full bg-inflight opacity-75 animate-ping" />
                      </span>
                    ) : (
                      <CheckCircle2Icon aria-hidden />
                    )}
                  </ChainOfThoughtIcon>
                  {step.label}
                </ChainOfThoughtStepTrigger>
                <ChainOfThoughtStepContent>
                  <p>{step.detail}</p>
                </ChainOfThoughtStepContent>
              </ChainOfThoughtStep>
            );
          })}
        </ChainOfThoughtContent>
      </ChainOfThought>
    </div>
  );
}
