import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { isValidElement, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import ShikiHighlighter from "react-shiki/web";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "#/components/ai/code-block";
import { Button } from "#/components/ai/button";
import {
  Message,
  MessageAction,
  MessageAvatar,
  MessageContent,
  MessageText,
} from "#/components/ai/message";

const reply = `Sure, here's a tiny React counter:

\`\`\`tsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((n) => n + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

Call \`useState\` once per piece of state and React will preserve it across renders.`;

type CodeProps = {
  className?: string;
  children?: ReactNode;
};

const components: Components = {
  pre({ children }) {
    if (!isValidElement<CodeProps>(children)) return <pre>{children}</pre>;

    const { className, children: code } = children.props;
    const language = className?.match(/language-(\w+)/)?.[1] ?? "text";
    const source = String(code ?? "").replace(/\n$/, "");

    return (
      <CodeBlock className="my-3">
        <CodeBlockHeader>
          <CodeBlockTitle>{language}</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          <ShikiHighlighter
            language={language}
            theme={{ light: "github-light", dark: "github-dark" }}
            defaultColor="light"
            addDefaultStyles={false}
            showLanguage={false}
            className="text-sm font-mono [&_pre]:bg-transparent! [&_pre]:outline-none!"
          >
            {source}
          </ShikiHighlighter>
        </CodeBlockContent>
      </CodeBlock>
    );
  },
  code({ className, children }) {
    return (
      <code
        className={`rounded bg-surface px-1 py-0.5 text-[0.85em] ring ring-border ${className ?? ""}`}
      >
        {children}
      </code>
    );
  },
};

export default function MarkdownDemo() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Message type="outgoing">
        <MessageContent>
          <MessageText variant="bubble">
            Show me a minimal React counter component.
          </MessageText>
        </MessageContent>
      </Message>
      <Message type="incoming">
        <MessageAvatar>AI</MessageAvatar>
        <MessageContent>
          <MessageText>
            <Markdown components={components}>{reply}</Markdown>
          </MessageText>
          <MessageAction>
            <Button
              iconOnly
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Copy"
            >
              <Copy />
            </Button>
            <Button
              iconOnly
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Regenerate"
            >
              <RefreshCw />
            </Button>
            <Button
              iconOnly
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Thumbs up"
            >
              <ThumbsUp />
            </Button>
            <Button
              iconOnly
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Thumbs down"
            >
              <ThumbsDown />
            </Button>
          </MessageAction>
        </MessageContent>
      </Message>
    </div>
  );
}
