import { Markdown } from "#/components/ai/markdown";

const source = `# Heading one

A short paragraph with **bold**, *italic*, and \`inline code\`. Visit the
[TanStack AI docs](https://tanstack.com/ai/) for more.

## Lists

- Apples
- Oranges
- Pears

1. First
2. Second
3. Third

> Streaming markdown should render gracefully while content is still arriving.

| Provider | Model     | Context |
| -------- | --------- | ------- |
| OpenAI   | gpt-4o    | 128k    |
| Google   | Gemini 2  | 1M      |
| Anthropic| Claude 4  | 200k    |

\`\`\`tsx
import { useState } from "react";

export function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
\`\`\`
`;

export default function BasicDemo() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Markdown>{source}</Markdown>
    </div>
  );
}
