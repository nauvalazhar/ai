import { Check, Copy } from "lucide-react";
import { useState } from "react";
import {
  CodeBlock,
  CodeBlockAction,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "#/components/ai/code-block";

const code = `import { CodeBlock } from "@/components/ai/code-block";

<CodeBlock>
  <CodeBlockContent>
    <pre>{code}</pre>
  </CodeBlockContent>
</CodeBlock>`;

export default function Actions() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>example.tsx</CodeBlockTitle>
          <CodeBlockAction>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy code"
              className="text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check /> : <Copy />}
            </button>
          </CodeBlockAction>
        </CodeBlockHeader>
        <CodeBlockContent>
          <pre>{code}</pre>
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
