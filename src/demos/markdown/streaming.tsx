import { useEffect, useRef, useState } from "react";
import { Markdown } from "#/components/ai/markdown";

const fullSource = `Sure, here's a tiny React counter:

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

The \`useState\` call preserves the value across renders. Try it out!`;

export default function StreamingDemo() {
  const [content, setContent] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = indexRef.current + 1;
      if (next > fullSource.length) {
        indexRef.current = 0;
        setContent("");
        return;
      }
      indexRef.current = next;
      setContent(fullSource.slice(0, next));
    }, 18);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Markdown>{content}</Markdown>
    </div>
  );
}
