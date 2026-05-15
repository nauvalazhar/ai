import { useState } from "react";
import {
  ArrowUpIcon,
  ClockIcon,
  CodeIcon,
  CompassIcon,
  FileTextIcon,
  HashIcon,
  ImageIcon,
  MessageSquareIcon,
  StarIcon,
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

const commands: ComposerItem[] = [
  {
    id: "chat",
    label: "Chat",
    description: "Quick assistant chat",
    icon: <MessageSquareIcon />,
    group: "General",
  },
  { id: "review", label: "Code review", icon: <CodeIcon />, group: "General" },
  {
    id: "feedback",
    label: "Feedback",
    icon: <CompassIcon />,
    group: "General",
  },
  {
    id: "model",
    label: "Model",
    description: "GPT-5.3-Codex",
    icon: <CompassIcon />,
    group: "Settings",
  },
  {
    id: "permissions",
    label: "Permissions",
    icon: <CompassIcon />,
    group: "Settings",
  },
  {
    id: "mcp",
    label: "MCP",
    description: "Show MCP server status",
    icon: <HashIcon />,
    group: "Settings",
  },
];

const mentions: ComposerItem[] = [
  {
    id: "recent-1",
    label: "composer.tsx",
    icon: <CodeIcon />,
    group: "Recent",
  },
  {
    id: "recent-2",
    label: "registry.config.ts",
    icon: <CodeIcon />,
    group: "Recent",
  },
  { id: "star-1", label: "tokens.css", icon: <StarIcon />, group: "Pinned" },
  { id: "star-2", label: "README.md", icon: <StarIcon />, group: "Pinned" },
  {
    id: "all-1",
    label: "package.json",
    icon: <FileTextIcon />,
    group: "Files",
  },
  { id: "all-2", label: "hero.png", icon: <ImageIcon />, group: "Files" },
  { id: "all-3", label: "styles.css", icon: <HashIcon />, group: "Files" },
];

export default function Groups() {
  const [last, setLast] = useState<ComposerValue | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <p className="text-sm text-muted-foreground">
        Items can carry an optional <code>group</code> label. Consecutive items
        with the same group share a header.
      </p>
      <Composer>
        <ComposerRichInput
          placeholder="Try / for grouped commands or @ for grouped files"
          onSubmit={(value) => setLast(value)}
          triggers={{
            "/": { items: commands },
            "@": { items: mentions },
          }}
        />
        <ComposerSuggestions
          renderGroup={(label) => (
            <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1 text-xs text-muted-foreground/80">
              {label === "Recent" ? (
                <ClockIcon className="size-3" />
              ) : label === "Pinned" ? (
                <StarIcon className="size-3" />
              ) : null}
              <span>{label}</span>
            </div>
          )}
        />
        <ComposerToolbar>
          <ComposerToolbarSpacer>
            <ComposerSubmit render={<Button iconOnly className="rounded-full" />}>
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
