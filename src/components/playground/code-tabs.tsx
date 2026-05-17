import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Check, Copy } from "lucide-react";
import { Children, isValidElement, useState, type ReactNode } from "react";
import { cn } from "#/lib/utils";
import { Button } from "../ai/button";
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockContent,
  CodeBlockHeader,
} from "../ai/code-block";
import { Syntax } from "./syntax";

type Tab = {
  value: string;
  lang: string;
  label: string;
  content: string;
};

function extractTabs(children: ReactNode): Tab[] {
  return Children.toArray(children)
    .filter(isValidElement)
    .map((child, index) => {
      const preProps = (child as React.ReactElement<{ children?: unknown }>)
        .props;
      const codeEl = preProps?.children as
        | { props?: { className?: string; children?: string; title?: string } }
        | undefined;
      const className = codeEl?.props?.className ?? "";
      const lang = /language-(\w+)/.exec(className)?.[1] ?? "tsx";
      const title = codeEl?.props?.title?.trim();
      const content = String(codeEl?.props?.children ?? "").replace(/\n$/, "");
      const label = title || lang || `Tab ${index + 1}`;
      return { value: String(index), lang, label, content };
    });
}

export function CodeTabs({ children }: { children?: ReactNode }) {
  const tabs = extractTabs(children);
  const [value, setValue] = useState("0");
  if (tabs.length === 0) return null;
  const active = tabs.find((t) => t.value === value) ?? tabs[0];

  return (
    <BaseTabs.Root
      value={value}
      onValueChange={(v) => setValue(String(v))}
      className="not-prose"
    >
      <CodeBlock className="gap-0.5">
        <CodeBlockHeader className="gap-3">
          <BaseTabs.List className="relative flex items-stretch gap-3.5">
            {tabs.map((tab) => (
              <BaseTabs.Tab
                key={tab.value}
                value={tab.value}
                className={cn(
                  "h-8 inline-flex items-center text-xs font-medium",
                  "text-muted-foreground hover:text-foreground",
                  "data-active:text-foreground",
                  "outline-none focus-visible:text-foreground",
                  "transition-colors cursor-pointer",
                )}
              >
                {tab.label}
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
          <CodeBlockAction>
            <CopyCodeButton text={active.content} />
          </CodeBlockAction>
        </CodeBlockHeader>
        <CodeBlockContent>
          <Syntax language={active.lang}>{active.content}</Syntax>
        </CodeBlockContent>
      </CodeBlock>
    </BaseTabs.Root>
  );
}

function CopyCodeButton({ text }: { text: string }) {
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
      aria-label="Copy code"
      className="text-muted-foreground hover:text-foreground"
      variant="ghost"
      iconOnly
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
