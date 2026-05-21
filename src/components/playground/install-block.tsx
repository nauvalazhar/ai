import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Check, ChevronDownIcon, Copy } from "lucide-react";
import { useMemo, useState, type ComponentType, type SVGProps } from "react";
import { SiBun, SiNpm, SiPnpm, SiYarn } from "react-icons/si";
import { cn } from "#/lib/utils";
import { Button } from "../ai/button";
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTrigger,
} from "../ai/code-block";
import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "../ai/select";
import { findComponentSource } from "./registry";
import { Syntax } from "./syntax";

type Method = "cli" | "shadcn" | "manual";
type PM = "bun" | "npm" | "pnpm" | "yarn";

type PmItem = {
  value: PM;
  label: string;
  icon: React.ReactNode;
};

const METHODS: { value: Method; label: string }[] = [
  { value: "cli", label: "CLI" },
  { value: "shadcn", label: "shadcn" },
  { value: "manual", label: "Manual" },
];

const PMS: PM[] = ["bun", "npm", "pnpm", "yarn"];

const PM_ICONS: Record<PM, ComponentType<SVGProps<SVGSVGElement>>> = {
  bun: SiBun,
  npm: SiNpm,
  pnpm: SiPnpm,
  yarn: SiYarn,
};

function buildCommand(method: "cli" | "shadcn", pm: PM, slug: string): string {
  const args =
    method === "cli"
      ? `@nauvalazhar/ai@latest add ${slug}`
      : `shadcn@latest add @aikit/${slug}`;
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
  const pmItems = useMemo<PmItem[]>(
    () =>
      PMS.map((p) => {
        const Icon = PM_ICONS[p];
        return {
          value: p,
          label: p,
          icon: <Icon className="size-3.5" />,
        };
      }),
    [],
  );
  const [pmValue, setPmValue] = useState<PmItem>(() => pmItems[0]);
  const pm = pmValue.value;
  const source = findComponentSource(slug);

  const isManual = method === "manual";
  const text = isManual
    ? (source ?? `// Source for "${slug}" not found.`)
    : buildCommand(method, pm, slug);
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
          <>
            <span aria-hidden className="h-4 w-px bg-border" />
            <Select
              items={pmItems}
              value={pmValue}
              onValueChange={(v) => setPmValue(v as PmItem)}
            >
              <SelectTrigger
                variant="plain"
                className="h-7 px-2 w-auto text-xs text-muted-foreground hover:text-foreground -ml-1.5"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectPopup align="start" sideOffset={4}>
                <SelectList>
                  {pmItems.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item}
                      className="text-xs"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SelectItem>
                  ))}
                </SelectList>
              </SelectPopup>
            </Select>
          </>
        )}

        <CodeBlockAction className="ml-auto">
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
