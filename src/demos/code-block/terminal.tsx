import AnsiModule from "ansi-to-react";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "#/components/ai/code-block";

// ansi-to-react ships CJS; Vite hands us the module object instead of the
// default function, so unwrap once and fall back when interop already did it.
const Ansi =
  (AnsiModule as unknown as { default?: typeof AnsiModule }).default ??
  AnsiModule;

const output = [
  "\x1b[2m$\x1b[0m bun test",
  "",
  "\x1b[32m✓\x1b[0m src/lib/utils.test.ts \x1b[2m> cn merges classes\x1b[0m \x1b[2m(2ms)\x1b[0m",
  "\x1b[32m✓\x1b[0m src/lib/utils.test.ts \x1b[2m> cn dedupes tailwind\x1b[0m \x1b[2m(1ms)\x1b[0m",
  "\x1b[31m✗\x1b[0m src/lib/format.test.ts \x1b[2m> formats currency\x1b[0m \x1b[2m(4ms)\x1b[0m",
  "  \x1b[31mAssertionError: expected '$1,000' to equal '$1,000.00'\x1b[0m",
  "    at \x1b[36msrc/lib/format.test.ts:14:24\x1b[0m",
  "",
  " \x1b[1m\x1b[32m2 pass\x1b[0m",
  " \x1b[1m\x1b[31m1 fail\x1b[0m",
  " \x1b[2mran 3 tests in 12ms\x1b[0m",
].join("\n");

export default function Terminal() {
  return (
    <div className="mx-auto max-w-2xl">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>Terminal</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          <pre>
            <Ansi>{output}</Ansi>
          </pre>
        </CodeBlockContent>
      </CodeBlock>
    </div>
  );
}
