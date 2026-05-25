import { FileTextIcon, SearchIcon } from "lucide-react";
import {
  Action,
  ActionContent,
  ActionIcon,
  ActionLabel,
  ActionTrigger,
} from "#/components/ai/action";
import {
  AgentRun,
  AgentRunContent,
  AgentRunHeader,
  AgentRunMeta,
  AgentRunStep,
  AgentRunText,
  AgentRunTitle,
} from "#/components/ai/agent-run";
import { Chip } from "#/components/ai/chip";
import { Status } from "#/components/ai/status";

export default function States() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <AgentRun state="running" defaultOpen>
        <AgentRunHeader>
          <AgentRunTitle>Reading the source files</AgentRunTitle>
          <Status state="inflight" size="sm" pulse>Running</Status>
          <AgentRunMeta>
            <span>2 of 4 steps</span>
            <span>·</span>
            <span>1.8s</span>
          </AgentRunMeta>
        </AgentRunHeader>
        <AgentRunContent>
          <AgentRunStep>
            <Action defaultOpen={false}>
              <ActionTrigger>
                <ActionIcon>
                  <FileTextIcon />
                </ActionIcon>
                <ActionLabel>Read</ActionLabel>
                <Chip size="sm">src/components/ai/tool.tsx</Chip>
              </ActionTrigger>
              <ActionContent>
                Read 217 lines from src/components/ai/tool.tsx.
              </ActionContent>
            </Action>
          </AgentRunStep>
          <AgentRunStep>
            <Action defaultOpen={false}>
              <ActionTrigger>
                <ActionIcon>
                  <SearchIcon />
                </ActionIcon>
                <ActionLabel>Search</ActionLabel>
                <Chip size="sm">ToolState</Chip>
              </ActionTrigger>
              <ActionContent>3 references across the project.</ActionContent>
            </Action>
          </AgentRunStep>
        </AgentRunContent>
      </AgentRun>

      <AgentRun state="completed" defaultOpen={false}>
        <AgentRunHeader>
          <AgentRunTitle>Draft the new component</AgentRunTitle>
          <Status state="active" size="sm">Completed</Status>
          <AgentRunMeta>
            <span>5 steps</span>
            <span>·</span>
            <span>12.4s</span>
          </AgentRunMeta>
        </AgentRunHeader>
        <AgentRunContent>
          <AgentRunStep>
            <AgentRunText>
              Drafted the parts, wired data attributes, exported the public
              surface.
            </AgentRunText>
          </AgentRunStep>
        </AgentRunContent>
      </AgentRun>

      <AgentRun state="failed" defaultOpen>
        <AgentRunHeader>
          <AgentRunTitle>Run the test suite</AgentRunTitle>
          <Status state="error" size="sm">Failed</Status>
          <AgentRunMeta>
            <span>1 of 3 steps</span>
            <span>·</span>
            <span>0.9s</span>
          </AgentRunMeta>
        </AgentRunHeader>
        <AgentRunContent>
          <AgentRunStep>
            <AgentRunText className="text-destructive">
              Could not find module @tanstack/ai-react. Install dependencies and
              retry.
            </AgentRunText>
          </AgentRunStep>
        </AgentRunContent>
      </AgentRun>

      <AgentRun state="stopped" defaultOpen={false}>
        <AgentRunHeader>
          <AgentRunTitle>Refactor the docs</AgentRunTitle>
          <Status state="neutral" size="sm">Stopped</Status>
          <AgentRunMeta>
            <span>stopped at step 2</span>
          </AgentRunMeta>
        </AgentRunHeader>
        <AgentRunContent>
          <AgentRunStep>
            <AgentRunText>
              Stopped by the user before the second action finished.
            </AgentRunText>
          </AgentRunStep>
        </AgentRunContent>
      </AgentRun>
    </div>
  );
}
