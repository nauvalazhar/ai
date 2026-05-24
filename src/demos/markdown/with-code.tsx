import { isValidElement, type ReactNode } from "react";
import type { Components } from "react-markdown";
import ShikiHighlighter from "react-shiki/web";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "#/components/ai/code-block";
import { Markdown } from "#/components/ai/markdown";

const source = `### Component

\`\`\`tsx
import { useState } from "react";

export function Toggle() {
  const [on, setOn] = useState(false);
  return <button onClick={() => setOn(!on)}>{on ? "on" : "off"}</button>;
}
\`\`\`

### Install

\`\`\`bash
bun add react-markdown remark-gfm
\`\`\`

### Config

\`\`\`json
{
  "name": "my-app",
  "private": true,
  "type": "module"
}
\`\`\`
`;

type CodeProps = {
  className?: string;
  children?: ReactNode;
};

const components: Components = {
  pre({ children }) {
    if (!isValidElement<CodeProps>(children)) return <pre>{children}</pre>;
    const { className, children: code } = children.props;
    const language = className?.match(/language-(\w+)/)?.[1] ?? "text";
    const value = String(code ?? "").replace(/\n$/, "");
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
            {value}
          </ShikiHighlighter>
        </CodeBlockContent>
      </CodeBlock>
    );
  },
};

export default function WithCodeDemo() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Markdown components={components}>{source}</Markdown>
    </div>
  );
}
