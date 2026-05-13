import { useState } from "react";
import {
  Prompt,
  PromptFooter,
  PromptHint,
  PromptOption,
  PromptQuestion,
  PromptStep,
  PromptSubmit,
} from "#/components/ai/prompt";

export default function Basic() {
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
      <Prompt
        onComplete={({ history }) => setAnswer(history)}
        onDismiss={() => setAnswer("dismissed")}
      >
        <PromptStep name="history" defaultValue="top-5">
          <PromptQuestion>
            What kind of high-score history do you want to show?
          </PromptQuestion>
          <PromptOption value="top-5">Top 5 scores (Recommended)</PromptOption>
          <PromptOption value="recent">Recent 5 games</PromptOption>
          <PromptOption value="top-10">Top 10 scores</PromptOption>
        </PromptStep>
        <PromptFooter>
          <PromptHint keys="ESC">Dismiss</PromptHint>
          <PromptSubmit />
        </PromptFooter>
      </Prompt>

      <div className="text-xs text-muted-foreground">
        Answer: <span className="text-foreground">{answer ?? "—"}</span>
      </div>
    </div>
  );
}
