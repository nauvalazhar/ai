import { useEffect, useState } from "react";
import { Button } from "#/components/ai/button";
import { Loader } from "#/components/ai/loader";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "#/components/ai/reasoning";

const REASONING_TEXT = `Reading the project structure first to understand how components are organized. There is a kit folder under src/components/ai and a demos folder mirroring each component, so new pieces should follow that shape.

Next, I should look at how an existing collapsible like Spec is wired up. That gives me the pattern for chevron rotation, the data attributes Base UI exposes, and how the panel animates its height.

The last decision is layout. A two-column grid for the header lets the trigger sit on the left and the stop button dock to the right, with the panel spanning both columns underneath.`;

export default function Streaming() {
  const [revealed, setRevealed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    if (!isStreaming) return;
    if (revealed >= REASONING_TEXT.length) {
      setIsStreaming(false);
      return;
    }
    const chunk =
      REASONING_TEXT.slice(revealed).match(/^(\S+\s*|\s+)/)?.[0] ?? "";
    const id = window.setTimeout(
      () => setRevealed((n) => n + chunk.length),
      30 + Math.random() * 60,
    );
    return () => window.clearTimeout(id);
  }, [isStreaming, revealed]);

  useEffect(() => {
    if (!isStreaming) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [isStreaming]);

  return (
    <div className="mx-auto max-w-2xl">
      <Reasoning defaultOpen>
        <ReasoningTrigger>
          {isStreaming ? (
            <Loader variant="shimmer" dots className="text-foreground">
              Thinking
            </Loader>
          ) : (
            `Thought for ${elapsed} ${elapsed === 1 ? "second" : "seconds"}`
          )}
        </ReasoningTrigger>
        {isStreaming && (
          <Button
            variant="ghost"
            onClick={() => setIsStreaming(false)}
            className="justify-self-end h-auto px-0 text-xs font-normal text-muted-foreground border-b border-dotted border-border rounded-none hover:bg-transparent hover:text-foreground hover:border-muted-foreground"
          >
            Skip thinking
          </Button>
        )}
        <ReasoningContent>
          <p className="whitespace-pre-line">
            {REASONING_TEXT.slice(0, revealed)}
            {isStreaming && (
              <span aria-hidden className="ml-0.5 animate-pulse">
                ▍
              </span>
            )}
          </p>
        </ReasoningContent>
      </Reasoning>
    </div>
  );
}
