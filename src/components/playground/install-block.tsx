import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Check, ChevronDownIcon, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "#/lib/utils";
import { Button } from "../ai/button";
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTrigger,
} from "../ai/code-block";
import { findComponentSource } from "./registry";
import { Syntax } from "./syntax";

type Method = "cli" | "shadcn" | "manual";
type PM = "bun" | "npm" | "pnpm" | "yarn";

const METHODS: { value: Method; label: string }[] = [
  { value: "cli", label: "CLI" },
  { value: "shadcn", label: "shadcn" },
  { value: "manual", label: "Manual" },
];

const PMS: { value: PM; label: string }[] = [
  { value: "bun", label: "bun" },
  { value: "npm", label: "npm" },
  { value: "pnpm", label: "pnpm" },
  { value: "yarn", label: "yarn" },
];

function cliCommand(pm: PM, slug: string): string {
  const args = `@nauvalazhar/ai@latest add ${slug}`;
  switch (pm) {
    case "bun":
      return `bunx ${args}`;
    case "npm":
      return `npx ${args}`;
    case "pnpm":
      return `pnpm dlx ${args}`;
    case "yarn":
      return `yarn dlx ${args}`;
  }
}

function shadcnCommand(pm: PM, slug: string): string {
  const args = `shadcn@latest add @aikit/${slug}`;
  switch (pm) {
    case "bun":
      return `bunx ${args}`;
    case "npm":
      return `npx ${args}`;
    case "pnpm":
      return `pnpm dlx ${args}`;
    case "yarn":
      return `yarn dlx ${args}`;
  }
}

export function InstallBlock({ slug }: { slug: string }) {
  const [method, setMethod] = useState<Method>("cli");
  const [pm, setPm] = useState<PM>("bun");
  const source = findComponentSource(slug);

  const isManual = method === "manual";
  const text = isManual
    ? (source ?? `// Source for "${slug}" not found.`)
    : method === "cli"
      ? cliCommand(pm, slug)
      : shadcnCommand(pm, slug);
  const language = isManual ? "tsx" : "bash";

  return (
    <CodeBlock className="not-prose my-6 relative" clip>
      <CodeBlockHeader className="gap-3 h-9">
        <BaseTabs.Root
          value={method}
          onValueChange={(v) => setMethod(String(v) as Method)}
        >
          <BaseTabs.List className="relative flex items-stretch gap-3.5">
            {METHODS.map((m) => (
              <BaseTabs.Tab
                key={m.value}
                value={m.value}
                className={cn(
                  "h-8 inline-flex items-center text-xs font-medium",
                  "text-muted-foreground hover:text-foreground",
                  "data-active:text-foreground",
                  "outline-none focus-visible:text-foreground",
                  "transition-colors cursor-pointer",
                )}
              >
                {m.label}
              </BaseTabs.Tab>
            ))}
            <BaseTabs.Indicator
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-(--active-tab-width)",
                "translate-x-(--active-tab-left) bg-foreground rounded-full",
                "transition-all duration-200 ease-out",
              )}
            />
          </BaseTabs.List>
        </BaseTabs.Root>

        {!isManual && (
          <BaseTabs.Root
            value={pm}
            onValueChange={(v) => setPm(String(v) as PM)}
            className="ml-auto"
          >
            <BaseTabs.List className="relative flex items-stretch gap-2.5">
              {PMS.map((p) => (
                <BaseTabs.Tab
                  key={p.value}
                  value={p.value}
                  className={cn(
                    "h-8 inline-flex items-center text-[11px] font-mono",
                    "text-muted-foreground hover:text-foreground",
                    "data-active:text-foreground",
                    "outline-none focus-visible:text-foreground",
                    "transition-colors cursor-pointer",
                  )}
                >
                  {p.label}
                </BaseTabs.Tab>
              ))}
              <BaseTabs.Indicator
                className={cn(
                  "absolute bottom-0 left-0 h-px w-(--active-tab-width)",
                  "translate-x-(--active-tab-left) bg-foreground/60 rounded-full",
                  "transition-all duration-200 ease-out",
                )}
              />
            </BaseTabs.List>
          </BaseTabs.Root>
        )}

        <CodeBlockAction className={cn(isManual && "ml-auto")}>
          <CopyButton key={`${method}-${pm}`} text={text} />
        </CodeBlockAction>
      </CodeBlockHeader>

      <CodeBlockContent>
        <Syntax language={language}>{text}</Syntax>
      </CodeBlockContent>

      <CodeBlockTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "text-foreground/80 hover:text-foreground",
              "absolute bottom-3 left-1/2 -translate-x-1/2",
              "hover:bg-transparent text-xs",
            )}
          >
            <ChevronDownIcon className="group-data-open/code-block:rotate-180" />
            <span className="group-data-open/code-block:inline hidden">
              Show Less
            </span>
            <span className="group-data-open/code-block:hidden inline">
              Show More
            </span>
          </Button>
        }
      />
    </CodeBlock>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <Button
      onClick={handleCopy}
      aria-label="Copy"
      className="text-muted-foreground hover:text-foreground"
      variant="ghost"
      iconOnly
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
