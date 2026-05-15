import { useState } from "react";
import { ArrowUpIcon, FileTextIcon, HashIcon, ImageIcon } from "lucide-react";
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

type FileKind = "doc" | "style" | "image";

const files: ComposerItem<{ kind: FileKind }>[] = [
  {
    id: "documents",
    label: "Documents",
    icon: <FileTextIcon />,
    data: { kind: "doc" },
  },
  {
    id: "readme",
    label: "README.md",
    icon: <FileTextIcon />,
    data: { kind: "doc" },
  },
  {
    id: "style",
    label: "style.css",
    icon: <HashIcon />,
    data: { kind: "style" },
  },
  {
    id: "tokens",
    label: "tokens.css",
    icon: <HashIcon />,
    data: { kind: "style" },
  },
  {
    id: "hero",
    label: "hero.png",
    icon: <ImageIcon />,
    data: { kind: "image" },
  },
];

function renderChip(item: ComposerItem<{ kind: FileKind }>) {
  const kind = item.data?.kind;

  return (
    <span
      data-kind={kind}
      className="inline-flex items-center align-middle data-[kind=style]:text-primary fle data-[kind=doc]:text-primary data-[kind=image]:text-emerald-500"
    >
      <span aria-hidden className="mr-1 inline-block [&>svg]:size-3.5">
        {item.icon}
      </span>
      {item.label}
    </span>
  );
}

export default function Mentions() {
  const [last, setLast] = useState<ComposerValue | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <Composer>
        <ComposerRichInput
          placeholder="Try @style or @hero to attach a file"
          onSubmit={(value) => setLast(value)}
          triggers={{
            "@": {
              items: files,
              renderChip: (item) =>
                renderChip(item as ComposerItem<{ kind: FileKind }>),
            },
          }}
        />
        <ComposerSuggestions />
        <ComposerToolbar>
          <ComposerToolbarSpacer>
            <ComposerSubmit render={<Button iconOnly className="rounded-full" />}>
              <ArrowUpIcon />
            </ComposerSubmit>
          </ComposerToolbarSpacer>
        </ComposerToolbar>
      </Composer>

      {last ? (
        <div className="flex flex-col gap-2 rounded-outer border border-border bg-surface p-3 text-xs">
          <div className="text-muted-foreground">Segments</div>
          <pre className="whitespace-pre-wrap text-foreground">
            {JSON.stringify(last.segments, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
