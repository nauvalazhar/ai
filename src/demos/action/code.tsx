import { TerminalIcon } from "lucide-react";
import {
  Action,
  ActionContent,
  ActionIcon,
  ActionLabel,
  ActionTrigger,
} from "#/components/ai/action";
import { Chip } from "#/components/ai/chip";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "#/components/ai/code-block";

const output = `> bun run typecheck
$ tsc --noEmit
✓ no errors`;

export default function Code() {
  return (
    <div className="mx-auto max-w-2xl">
      <Action defaultOpen>
        <ActionTrigger>
          <ActionIcon>
            <TerminalIcon />
          </ActionIcon>
          <ActionLabel>Ran</ActionLabel>
          <Chip size="sm">bun run typecheck</Chip>
        </ActionTrigger>
        <ActionContent>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>shell</CodeBlockTitle>
            </CodeBlockHeader>
            <CodeBlockContent>
              <pre>{output}</pre>
            </CodeBlockContent>
          </CodeBlock>
        </ActionContent>
      </Action>
    </div>
  );
}
