import { useState } from "react";
import { ArrowUpIcon, EraserIcon, SparklesIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Composer,
  ComposerInput,
  ComposerSubmit,
  ComposerToolbar,
  ComposerToolbarSpacer,
} from "#/components/ai/composer";

const TEMPLATE = "Summarize the latest release notes and flag breaking changes.";

export default function Controlled() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <p className="text-sm text-muted-foreground">
        The parent owns the text. Type, prefill from a template, or clear it from
        outside the composer. After submit, the parent decides when to clear.
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => setText(TEMPLATE)}
        >
          <SparklesIcon />
          Load template
        </Button>
        <Button
          variant="ghost"
          onClick={() => setText("")}
          disabled={text.length === 0}
        >
          <EraserIcon />
          Clear
        </Button>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {text.length} chars
        </span>
      </div>

      <Composer>
        <ComposerInput
          placeholder="Write a prompt or load the template."
          value={text}
          onValueChange={setText}
          onSubmit={(submitted) => {
            setHistory((prev) => [submitted, ...prev].slice(0, 5));
            setText("");
          }}
        />
        <ComposerToolbar>
          <ComposerToolbarSpacer>
            <ComposerSubmit render={<Button iconOnly className="rounded-full" />}>
              <ArrowUpIcon />
            </ComposerSubmit>
          </ComposerToolbarSpacer>
        </ComposerToolbar>
      </Composer>

      {history.length > 0 ? (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">Recent submissions</div>
          {history.map((entry, i) => (
            <div
              key={`${i}-${entry}`}
              className="rounded-outer border border-border bg-surface p-3 text-xs"
            >
              <pre className="whitespace-pre-wrap text-foreground">{entry}</pre>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
