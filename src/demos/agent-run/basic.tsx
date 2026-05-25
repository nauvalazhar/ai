import { FileTextIcon, FolderTreeIcon, SearchIcon } from "lucide-react";
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

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <AgentRun state="completed" defaultOpen>
        <AgentRunHeader>
          <AgentRunTitle>Explore codebase</AgentRunTitle>
          <Status state="active" size="sm">Completed</Status>
          <AgentRunMeta>
            <span>3 steps</span>
            <span>·</span>
            <span>4.2s</span>
          </AgentRunMeta>
        </AgentRunHeader>
        <AgentRunContent>
          <AgentRunStep>
            <AgentRunText>
              Looking through the project to map out where components and demos
              live so the new file lands in the right folder.
            </AgentRunText>
          </AgentRunStep>

          <AgentRunStep>
            <Action defaultOpen={false}>
              <ActionTrigger>
                <ActionIcon>
                  <FolderTreeIcon />
                </ActionIcon>
                <ActionLabel>List</ActionLabel>
                <Chip size="sm">src/components/ai</Chip>
              </ActionTrigger>
              <ActionContent>
                Found 41 components grouped under one folder.
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
                <Chip size="sm">data-slot</Chip>
              </ActionTrigger>
              <ActionContent>
                Every component sets a data-slot attribute on its root for CSS
                targeting.
              </ActionContent>
            </Action>
          </AgentRunStep>

          <AgentRunStep>
            <Action defaultOpen={false}>
              <ActionTrigger>
                <ActionIcon>
                  <FileTextIcon />
                </ActionIcon>
                <ActionLabel>Read</ActionLabel>
                <Chip size="sm">CONVENTIONS.md</Chip>
              </ActionTrigger>
              <ActionContent>
                Components stay free of SDK types. Heavy renderers are sibling
                components, not internals.
              </ActionContent>
            </Action>
          </AgentRunStep>

          <AgentRunStep>
            <AgentRunText>
              The kit follows a copy-paste model with one file per component
              family. New files land under <code>src/components/ai</code> with a
              matching demos folder.
            </AgentRunText>
          </AgentRunStep>
        </AgentRunContent>
      </AgentRun>
    </div>
  );
}
