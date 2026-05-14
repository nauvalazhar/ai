import { useState } from "react";
import {
  Prompt,
  PromptFooter,
  PromptHint,
  PromptOption,
  PromptOptionOther,
  PromptQuestion,
  PromptStep,
  PromptSubmit,
  usePrompt,
} from "#/components/ai/prompt";

function StepIndicator() {
  const { stepIndex, totalSteps } = usePrompt();
  if (totalSteps <= 1) return null;
  return (
    <span className="text-xs text-muted-foreground tabular-nums mr-auto">
      {stepIndex + 1} / {totalSteps}
    </span>
  );
}

export default function MultiStep() {
  const [result, setResult] = useState<Record<string, string> | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
      <Prompt onComplete={setResult}>
        <PromptStep name="history" defaultValue="top-5">
          <PromptQuestion>What kind of history do you want?</PromptQuestion>
          <PromptOption value="top-5">Top 5 scores (Recommended)</PromptOption>
          <PromptOption value="recent">Recent 5 games</PromptOption>
          <PromptOption value="top-10">Top 10 scores</PromptOption>
        </PromptStep>

        <PromptStep name="range">
          <PromptQuestion>Over what range?</PromptQuestion>
          <PromptOption value="week">Last week</PromptOption>
          <PromptOption value="month">Last month</PromptOption>
          <PromptOption value="all">All time</PromptOption>
        </PromptStep>

        <PromptStep name="confirm" defaultValue="yes">
          <PromptQuestion>Run with these settings?</PromptQuestion>
          <PromptOption value="yes">Yes, run it</PromptOption>
          <PromptOptionOther placeholder="No, tell me what to change" />
        </PromptStep>

        <PromptFooter className="max-sm:flex-wrap">
          <div className="flex items-center w-full justify-end gap-3">
            <StepIndicator />
            <PromptHint keys="Shift+Tab">Back</PromptHint>
            <PromptHint keys="ESC">Dismiss</PromptHint>
          </div>
          <PromptSubmit />
        </PromptFooter>
      </Prompt>

      <pre className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
        {result ? JSON.stringify(result, null, 2) : "—"}
      </pre>
    </div>
  );
}
