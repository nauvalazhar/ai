import { useState } from "react";
import {
  ArrowUpIcon,
  EraserIcon,
  FileTextIcon,
  HashIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Composer,
  ComposerSubmit,
  ComposerToolbar,
  ComposerToolbarSpacer,
} from "#/components/ai/composer";
import {
  ComposerRichInput,
  ComposerSuggestions,
  type ComposerItem,
  type ComposerValue,
} from "#/components/ai/composer-rich";

const mentions: ComposerItem[] = [
  { id: "readme", label: "README.md", icon: <FileTextIcon /> },
  { id: "package", label: "package.json", icon: <FileTextIcon /> },
  { id: "composer", label: "composer.tsx", icon: <HashIcon /> },
];

const EMPTY: ComposerValue = { text: "", segments: [] };

const TEMPLATE: ComposerValue = {
  text: "Review the changes in {{@:composer}} and outline test gaps.",
  segments: [
    { type: "text", value: "Review the changes in " },
    {
      type: "chip",
      trigger: "@",
      item: { id: "composer", label: "composer.tsx", icon: <HashIcon /> },
    },
    { type: "text", value: " and outline test gaps." },
  ],
};

export default function Controlled() {
  const [value, setValue] = useState<ComposerValue>(EMPTY);
  const [last, setLast] = useState<ComposerValue | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <p className="text-sm text-muted-foreground">
        The parent owns the editor content as a `ComposerValue`. Prefill a draft
        with a chip already embedded, or clear it externally. The editor stays
        in sync with the prop on every render.
      </p>

      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => setValue(TEMPLATE)}>
          Load draft with mention
        </Button>
        <Button
          variant="ghost"
          onClick={() => setValue(EMPTY)}
          disabled={value.text.length === 0 && value.segments.length === 0}
        >
          <EraserIcon />
          Clear
        </Button>
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {value.text.length} chars
        </span>
      </div>

      <Composer>
        <ComposerRichInput
          placeholder="Type @ to mention a file."
          triggers={{ "@": { items: mentions, hideOnEmpty: false } }}
          value={value}
          onValueChange={setValue}
          onSubmit={(v) => {
            setLast(v);
            setValue(EMPTY);
          }}
        />
        <ComposerSuggestions />
        <ComposerToolbar>
          <ComposerToolbarSpacer>
            <ComposerSubmit
              render={<Button iconOnly className="rounded-full" />}
            >
              <ArrowUpIcon />
            </ComposerSubmit>
          </ComposerToolbarSpacer>
        </ComposerToolbar>
      </Composer>

      {last ? (
        <div className="rounded-outer border border-border bg-surface p-3 text-xs">
          <div className="mb-1.5 text-muted-foreground">Last submitted</div>
          <pre className="whitespace-pre-wrap text-foreground">{last.text}</pre>
        </div>
      ) : null}
    </div>
  );
}
