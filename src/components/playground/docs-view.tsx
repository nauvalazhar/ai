import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "#/lib/utils";
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "../ai/code-block";
import {
  Spec,
  SpecContent,
  SpecField,
  SpecFieldLabel,
  SpecFieldValue,
  SpecHeader,
  SpecItem,
  SpecTrigger,
} from "../ai/spec";
import type { PassThrough, Part } from "./docs-types";
import type { DocsEntry } from "./registry";
import { Syntax } from "./syntax";
import { Button } from "../ai/button";
import { SiMarkdown } from "react-icons/si";
import { SidebarOpenToggle } from "./sidebar-toggle";

export function DocsView({
  title,
  entry,
}: {
  title: string;
  entry: DocsEntry;
}) {
  const { Component, frontmatter, source } = entry;
  const partsByName = new Map(frontmatter.parts.map((p) => [p.name, p]));

  const components = {
    pre: PreBlock,
    Props: ({ name }: { name: string }) => {
      const part = partsByName.get(name);
      if (!part) return null;
      return <PartProps part={part} />;
    },
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      <SidebarOpenToggle />
      <div className="absolute right-0 top-12 z-10">
        <CopyMarkdownButton
          title={title}
          source={source}
          parts={frontmatter.parts}
        />
      </div>
      <article
        className={cn(
          "prose prose-sm dark:prose-invert max-w-none py-12",
          "prose-headings:font-medium",
          "prose-h1:mb-3 prose-h1:text-2xl",
          "prose-h2:text-xl prose-h2:mt-14",
          "prose-h3:text-base prose-h3:font-mono prose-h3:mt-14",
          // Lead paragraph: first <p> right after the <h1>.
          "[&>h1+p]:text-base [&>h1+p]:mt-3 [&>h1+p]:mb-8",
          // Collapse the gap when an <h3> sits directly under an <h2>.
          "[&>h2+h3]:mt-4",
        )}
      >
        <h1>{title}</h1>
        <Component components={components} />
      </article>
    </div>
  );
}

function PreBlock({ children }: { children?: ReactNode }) {
  // MDX renders fenced code as <pre><code className="language-xxx">…</code></pre>.
  const codeEl = children as
    | { props?: { className?: string; children?: string } }
    | undefined;
  const className = codeEl?.props?.className ?? "";
  const lang = /language-(\w+)/.exec(className)?.[1] ?? "tsx";
  const content = String(codeEl?.props?.children ?? "").replace(/\n$/, "");

  return (
    <CodeBlock className="not-prose">
      <CodeBlockHeader>
        <CodeBlockTitle>{lang.toUpperCase()}</CodeBlockTitle>
        <CodeBlockAction>
          <CopyCodeButton text={content} />
        </CodeBlockAction>
      </CodeBlockHeader>
      <CodeBlockContent className="overflow-auto">
        <Syntax language={lang}>{content}</Syntax>
      </CodeBlockContent>
    </CodeBlock>
  );
}

function PartProps({ part }: { part: Part }) {
  const explicit = part.props ?? [];
  if (explicit.length === 0 && !part.passThrough) return null;

  return (
    <Spec cols="grid-cols-[35%_65%]" className="not-prose my-6">
      <SpecHeader>
        <span>Prop</span>
        <span className="hidden md:inline">Type</span>
      </SpecHeader>
      {explicit.map((p) => (
        <SpecItem key={p.name}>
          <SpecTrigger>
            <span className="font-mono text-purple-400">{p.name}</span>
            <span className="font-mono text-site-foreground hidden md:inline">
              {p.type}
            </span>
          </SpecTrigger>
          <SpecContent>
            {p.description && (
              <p className="text-sm m-0 text-site-muted">
                <Inline text={p.description} />
              </p>
            )}
            <SpecField>
              <SpecFieldLabel>Type</SpecFieldLabel>
              <SpecFieldValue>
                <code className="font-mono text-site-foreground">{p.type}</code>
              </SpecFieldValue>
            </SpecField>
            {p.default && (
              <SpecField>
                <SpecFieldLabel>Default</SpecFieldLabel>
                <SpecFieldValue>
                  <code className="font-mono text-site-foreground">
                    {p.default}
                  </code>
                </SpecFieldValue>
              </SpecField>
            )}
          </SpecContent>
        </SpecItem>
      ))}
      {part.passThrough && (
        <SpecItem key="__passThrough">
          <SpecTrigger>
            <span className="font-mono text-purple-400">...props?</span>
            <span className="font-mono text-site-foreground hidden md:inline">
              {part.passThrough.type}
            </span>
          </SpecTrigger>
          <SpecContent>
            <p className="text-sm m-0 text-site-muted">
              <PassThroughDescription passThrough={part.passThrough} />
            </p>
          </SpecContent>
        </SpecItem>
      )}
    </Spec>
  );
}

function PassThroughDescription({ passThrough }: { passThrough: PassThrough }) {
  if (passThrough.description) {
    return <Inline text={passThrough.description} />;
  }
  if (passThrough.docsUrl) {
    return (
      <>
        Any other props are forwarded to{" "}
        <a
          href={passThrough.docsUrl.href}
          target="_blank"
          rel="noreferrer noopener"
        >
          {passThrough.docsUrl.label}
        </a>
        .
      </>
    );
  }
  if (passThrough.to) {
    const isHtml = /^<[a-z][a-z0-9]*>$/i.test(passThrough.to);
    if (isHtml) {
      const tag = passThrough.to.slice(1, -1);
      return <>Any other props are spread to the underlying {tag}.</>;
    }
    return (
      <>
        Any other props are spread to{" "}
        <code className="font-mono">{passThrough.to}</code>.
      </>
    );
  }
  return <>Any other props are spread to the underlying element.</>;
}

function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") && p.endsWith("`") ? (
          <code key={i} className="font-mono">
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function CopyMarkdownButton({
  title,
  source,
  parts,
}: {
  title: string;
  source: string;
  parts: Part[];
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const md = serializeMarkdown(title, source, parts);
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <Button
      onClick={handleCopy}
      aria-label="Copy page as markdown"
      variant="outline"
      className="text-xs text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check /> : <SiMarkdown />}
      Copy Markdown
    </Button>
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
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy code"
      className="text-muted-foreground hover:text-foreground"
    >
      {copied ? <Check /> : <Copy />}
    </button>
  );
}

function passThroughMarkdownDescription(passThrough: PassThrough): string {
  if (passThrough.description) return passThrough.description;
  if (passThrough.docsUrl) {
    return `Any other props are forwarded to [${passThrough.docsUrl.label}](${passThrough.docsUrl.href}).`;
  }
  if (passThrough.to) {
    const isHtml = /^<[a-z][a-z0-9]*>$/i.test(passThrough.to);
    if (isHtml) {
      const tag = passThrough.to.slice(1, -1);
      return `Any other props are spread to the underlying ${tag}.`;
    }
    return `Any other props are spread to \`${passThrough.to}\`.`;
  }
  return "Any other props are spread to the underlying element.";
}

function serializeMarkdown(
  title: string,
  source: string,
  parts: Part[],
): string {
  const partsByName = new Map(parts.map((p) => [p.name, p]));
  const body = source.replace(/^---[\s\S]*?---\n*/, "");
  const replaced = body.replace(
    /<Props\s+name="([^"]+)"\s*\/>/g,
    (_, name: string) => {
      const part = partsByName.get(name);
      if (!part) return "";
      const explicit = part.props ?? [];
      if (explicit.length === 0 && !part.passThrough) return "";
      const header =
        "| Prop | Type | Default | Description |\n|------|------|---------|-------------|";
      const explicitRows = explicit.map((p) => {
        const type = `\`${p.type.replace(/\|/g, "\\|")}\``;
        const def = p.default ? `\`${p.default}\`` : "—";
        const desc = (p.description ?? "").replace(/\|/g, "\\|");
        return `| \`${p.name}\` | ${type} | ${def} | ${desc} |`;
      });
      const rows = [...explicitRows];
      if (part.passThrough) {
        const type = `\`${part.passThrough.type.replace(/\|/g, "\\|")}\``;
        const desc = passThroughMarkdownDescription(part.passThrough).replace(
          /\|/g,
          "\\|",
        );
        rows.push(`| \`...props?\` | ${type} | — | ${desc} |`);
      }
      return `${header}\n${rows.join("\n")}`;
    },
  );
  return `# ${title}\n\n${replaced.trim()}\n`;
}
