import { useState } from "react";
import { ArrowUpIcon, FileTextIcon, ImageIcon } from "lucide-react";
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
import { cn } from "#/lib/utils";

type FileMeta = {
  path: string;
  mime: string;
  size: number;
};

const files: ComposerItem<FileMeta>[] = [
  {
    id: "f-readme",
    label: "README.md",
    icon: <FileTextIcon />,
    data: { path: "/README.md", mime: "text/markdown", size: 524 },
  },
  {
    id: "f-pkg",
    label: "package.json",
    icon: <FileTextIcon />,
    data: { path: "/package.json", mime: "application/json", size: 1742 },
  },
  {
    id: "f-tokens",
    label: "tokens.css",
    icon: <FileTextIcon />,
    data: { path: "/src/styles/tokens.css", mime: "text/css", size: 2210 },
  },
  {
    id: "f-hero",
    label: "hero.png",
    icon: <ImageIcon />,
    data: { path: "/public/hero.png", mime: "image/png", size: 38_412 },
  },
];

async function fetchContent(path: string) {
  await new Promise((r) => setTimeout(r, 220));
  return `// content of ${path}\n// (this is where the API call would land)`;
}

type ResolvedAttachment = {
  id: string;
  label: string;
  path: string;
  mime: string;
  content: string;
};

export default function CustomData() {
  const [submitted, setSubmitted] = useState<ComposerValue<FileMeta> | null>(null);
  const [resolved, setResolved] = useState<ResolvedAttachment[]>([]);
  const [resolving, setResolving] = useState(false);

  async function handleSubmit(value: ComposerValue<FileMeta>) {
    setSubmitted(value);
    const chips = value.segments.flatMap((s) => (s.type === "chip" ? [s.item] : []));
    if (chips.length === 0) {
      setResolved([]);
      return;
    }
    setResolving(true);
    const results = await Promise.all(
      chips.map(async (item) => ({
        id: item.id,
        label: item.label,
        path: item.data?.path ?? "",
        mime: item.data?.mime ?? "",
        content: item.data ? await fetchContent(item.data.path) : "",
      })),
    );
    setResolved(results);
    setResolving(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
        <p>
          Each file item carries <code>data: {`{ path, mime, size }`}</code>. The chip stores
          identity only, but the full <code>data</code> payload round-trips through{" "}
          <code>onSubmit</code> intact, so the call site can either read it directly or use the
          <code> id</code> to fetch heavier content from an API.
        </p>
        <p>Try @hero or @tokens, then submit.</p>
      </div>

      <Composer>
        <ComposerRichInput
          placeholder="Mention a file with @"
          onSubmit={(value) => handleSubmit(value as ComposerValue<FileMeta>)}
          triggers={{
            "@": { items: files },
          }}
        />
        <ComposerSuggestions
          renderItem={(item, { highlighted }) => {
            const meta = (item as ComposerItem<FileMeta>).data;
            return (
              <div
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-1.5 rounded text-sm",
                  highlighted && "bg-accent",
                )}
              >
                <span className="inline-flex items-center text-muted-foreground [&>svg]:size-4">
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
                {meta ? (
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                    {(meta.size / 1024).toFixed(1)} kB
                  </span>
                ) : null}
              </div>
            );
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

      {submitted ? (
        <div className="flex flex-col gap-3 rounded-outer border border-border bg-surface p-3 text-xs">
          <div>
            <div className="mb-1.5 text-muted-foreground">Submitted text</div>
            <pre className="whitespace-pre-wrap text-foreground">{submitted.text}</pre>
          </div>
          <div>
            <div className="mb-1.5 text-muted-foreground">
              Read directly from <code>segment.item.data</code>
            </div>
            <pre className="whitespace-pre-wrap text-foreground">
              {JSON.stringify(
                submitted.segments
                  .filter((s) => s.type === "chip")
                  .map((s) => (s.type === "chip" ? s.item.data : null)),
                null,
                2,
              )}
            </pre>
          </div>
          <div>
            <div className="mb-1.5 text-muted-foreground">
              Manual lookup by <code>item.id</code> (mock fetch)
            </div>
            {resolving ? (
              <div className="text-muted-foreground">Resolving…</div>
            ) : (
              <pre className="whitespace-pre-wrap text-foreground">
                {JSON.stringify(resolved, null, 2)}
              </pre>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
