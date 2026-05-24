import ShikiHighlighter from "#/lib/shiki";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "#/components/ai/code-block";

const code = `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((n) => n + 1)}>
      Clicked {count} times
    </button>
  );
}`;

export default function Syntax() {
  return (
    <div className="mx-auto max-w-2xl">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>counter.tsx</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          <ShikiHighlighter
            language="tsx"
            theme={{ light: "github-light", dark: "github-dark" }}
            defaultColor="light"
            addDefaultStyles={false}
            showLanguage={false}
            className="text-sm font-mono [&_pre]:bg-transparent! [&_pre]:outline-none!"
          >
            {code}
          </ShikiHighlighter>
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
