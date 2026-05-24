import { isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "#/components/ai/code-block";
import { cn } from "#/lib/utils";

type MarkdownProps = React.ComponentProps<"div"> & {
  children: string;
  components?: Components;
};

type CodeProps = {
  className?: string;
  children?: ReactNode;
};

const defaultComponents: Components = {
  pre({ children }) {
    if (!isValidElement<CodeProps>(children)) return <pre>{children}</pre>;

    const { className, children: code } = children.props;
    const language = className?.match(/language-(\w+)/)?.[1] ?? "text";
    const source = String(code ?? "").replace(/\n$/, "");

    return (
      <CodeBlock className="not-prose my-3">
        <CodeBlockHeader>
          <CodeBlockTitle>{language}</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          <pre className="whitespace-pre-wrap wrap-break-word">{source}</pre>
        </CodeBlockContent>
      </CodeBlock>
    );
  },
};

// Streaming markdown can land mid-fence. If we have an odd number of ``` markers
// the renderer otherwise dumps the remainder as plain text and the layout shifts
// the moment the closing fence arrives. Synthesizing a closing fence keeps the
// block stable until the real one lands.
function closeIncompleteFence(source: string) {
  const fences = source.match(/```/g);
  if (fences && fences.length % 2 === 1) return `${source}\n\`\`\``;
  return source;
}

export function Markdown({
  children,
  components,
  className,
  ...props
}: MarkdownProps) {
  const merged = components
    ? { ...defaultComponents, ...components }
    : defaultComponents;

  return (
    <div
      data-slot="markdown"
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none min-w-0",
        className,
      )}
      {...props}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={merged}>
        {closeIncompleteFence(children)}
      </ReactMarkdown>
    </div>
  );
}
