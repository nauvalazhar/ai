import { PlayIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import { Chip } from "#/components/ai/chip";
import {
  Sandbox,
  SandboxAction,
  SandboxContent,
  SandboxHeader,
  SandboxPanel,
  SandboxTab,
  SandboxTabs,
  SandboxTabsList,
  SandboxTitle,
  SandboxTrigger,
} from "#/components/ai/sandbox";

const code = `select count(*) as users
from accounts
where created_at > now() - interval '30 days';`;

export default function Collapsed() {
  return (
    <div className="mx-auto max-w-2xl">
      <Sandbox>
        <SandboxHeader>
          <SandboxTrigger>
            <SandboxTitle>recent-users.sql</SandboxTitle>
            <Chip size="sm" className="text-muted-foreground">
              idle
            </Chip>
          </SandboxTrigger>
          <SandboxAction>
            <Button variant="secondary" iconOnly aria-label="Run">
              <PlayIcon />
            </Button>
          </SandboxAction>
        </SandboxHeader>
        <SandboxContent>
          <SandboxTabs defaultValue="input">
            <SandboxTabsList>
              <SandboxTab value="input">Input</SandboxTab>
              <SandboxTab value="output">Output</SandboxTab>
            </SandboxTabsList>
            <SandboxPanel value="input">
              <pre className="text-sm font-mono">{code}</pre>
            </SandboxPanel>
            <SandboxPanel value="output">
              <p className="text-sm text-muted-foreground">
                Run the query to see output.
              </p>
            </SandboxPanel>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    </div>
  );
}
