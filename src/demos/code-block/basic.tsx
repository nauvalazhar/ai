import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "#/components/ai/code-block";

const code = `function greet(name) {
  return \`Hello, \${name}!\`;
}`;

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>JS</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          <pre>{code}</pre>
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
