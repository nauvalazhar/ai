import { useEffect, useState, type ReactNode } from "react";
import { Check, ChevronDownIcon, Copy, Info } from "lucide-react";
import { cn } from "#/lib/utils";
import { Callout, CalloutContent, CalloutIcon } from "../ai/callout";
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockTrigger,
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
import { CodeTabs } from "./code-tabs";
import { Button } from "../ai/button";
import { SiMarkdown } from "react-icons/si";
import { SidebarOpenToggle } from "./sidebar-toggle";
import { InstallBlock } from "./install-block";
import { FrameworkCards } from "./framework-cards";

export function DocsView({
  title,
  entry,
  componentSlug,
}: {
  title: string;
  entry: DocsEntry;
  componentSlug?: string;
}) {
  const { Component, frontmatter, source } = entry;
  const partsByName = new Map(frontmatter.parts.map((p) => [p.name, p]));

  const leadText = componentSlug ? extractLeadParagraph(source) : "";

  const components = {
    pre: PreBlock,
    h2: (props: { children?: ReactNode }) => (
      <SluggedHeading level={2} {...props} />
    ),
    h3: (props: { children?: ReactNode }) => (
      <SluggedHeading level={3} {...props} />
    ),
    p: (props: { children?: ReactNode }) => {
      if (
        componentSlug &&
        leadText &&
        normalizeWhitespace(extractText(props.children)) === leadText
      ) {
        return (
          <>
            <p {...props} />
            <InstallBlock slug={componentSlug} />
          </>
        );
      }
      return <p {...props} />;
    },
    Props: ({ name }: { name: string }) => {
      const part = partsByName.get(name);
      if (!part) return null;
      return <PartProps part={part} />;
    },
    Note: ({ children }: { children?: ReactNode }) => (
      <Callout className="not-prose my-6">
        <CalloutIcon>
          <Info />
        </CalloutIcon>
        <CalloutContent>{children}</CalloutContent>
      </Callout>
    ),
    table: (props: React.ComponentProps<"table">) => (
      <div className="not-prose my-6 overflow-hidden rounded-outer ring ring-border">
        <table className="w-full border-collapse text-sm" {...props} />
      </div>
    ),
    thead: (props: React.ComponentProps<"thead">) => (
      <thead className="bg-surface" {...props} />
    ),
    tbody: (props: React.ComponentProps<"tbody">) => <tbody {...props} />,
    tr: (props: React.ComponentProps<"tr">) => (
      <tr className="border-b border-border last:border-b-0" {...props} />
    ),
    th: (props: React.ComponentProps<"th">) => (
      <th
        className="px-4 py-3 text-left text-xs text-muted-foreground font-medium border-b border-border"
        {...props}
      />
    ),
    td: (props: React.ComponentProps<"td">) => (
      <td className="px-4 py-3 text-foreground" {...props} />
    ),
    CodeTabs,
    FrameworkCards,
  };

  useHashScroll(entry);

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
          "prose-h2:text-xl prose-h2:mt-14 prose-h2:scroll-mt-6",
          "prose-h3:text-base prose-h3:font-mono prose-h3:mt-14 prose-h3:scroll-mt-6",
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

function extractLeadParagraph(source: string): string {
  const body = source.replace(/^---[\s\S]*?---\s*/, "");
  const match = body.match(/^([^\n#].*?)(?=\n\s*\n|\n\s*#|$)/s);
  if (!match) return "";
  let lead = match[1].replace(/\s+/g, " ").trim();
  lead = lead.replace(/`([^`]+)`/g, "$1");
  lead = lead.replace(/\*\*([^*]+)\*\*/g, "$1");
  lead = lead.replace(/\*([^*]+)\*/g, "$1");
  lead = lead.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  return lead;
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function SluggedHeading({
  level,
  children,
}: {
  level: 2 | 3;
  children?: ReactNode;
}) {
  const id = slugify(extractText(children));
  const Tag = `h${level}` as const;
  return <Tag id={id || undefined}>{children}</Tag>;
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: ReactNode } }).props;
    return extractText(props?.children);
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function useHashScroll(dep: unknown) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    function scrollToHash() {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      const el = document.getElementById(decodeURIComponent(hash));
      if (el) el.scrollIntoView({ block: "start" });
    }
    const id = window.requestAnimationFrame(scrollToHash);
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [dep]);
}

function PreBlock({ children }: { children?: ReactNode }) {
  // MDX renders fenced code as <pre><code className="language-xxx">…</code></pre>.
  // Meta after the language (e.g. `title="src/utils.ts"`) is promoted to props
  // on the inner <code> by the `remarkCodeMeta` plugin in vite.config.ts.
  const codeEl = children as
    | { props?: { className?: string; children?: string; title?: string } }
    | undefined;
  const className = codeEl?.props?.className ?? "";
  const lang = /language-(\w+)/.exec(className)?.[1] ?? "tsx";
  const title = codeEl?.props?.title?.trim();
  const content = String(codeEl?.props?.children ?? "").replace(/\n$/, "");

  return (
    <CodeBlock className="not-prose relative" clip>
      <CodeBlockHeader>
        <CodeBlockTitle>{title || lang.toUpperCase()}</CodeBlockTitle>
        <CodeBlockAction>
          <CopyCodeButton text={content} />
        </CodeBlockAction>
      </CodeBlockHeader>
      <CodeBlockContent>
        <Syntax language={lang}>{content}</Syntax>
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
          className="text-foreground border-b border-foreground"
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
      Copy Page
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
  const unwrapped = body.replace(
    /<CodeTabs[^>]*>\s*([\s\S]*?)\s*<\/CodeTabs>/g,
    "$1",
  );
  const replaced = unwrapped.replace(
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
