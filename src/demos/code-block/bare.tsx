import {
  CodeBlock,
  CodeBlockContent,
} from "#/components/ai/code-block";

const code = `bun install
bun run dev`;

export default function Bare() {
  return (
    <div className="mx-auto max-w-2xl">
      <CodeBlock>
        <CodeBlockContent>
          <pre>{code}</pre>
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
