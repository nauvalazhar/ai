import {
  CloudIcon,
  FileTextIcon,
  FolderTreeIcon,
  SearchIcon,
} from "lucide-react";
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
import {
  Tool,
  ToolBlock,
  ToolContent,
  ToolIcon,
  ToolLabel,
  ToolName,
  ToolSubtitle,
  ToolTrigger,
} from "#/components/ai/tool";
import {
  UsageMeter,
  UsageStat,
  UsageStatLabel,
  UsageStatValue,
} from "#/components/ai/usage-meter";

const weatherInput = `{
  "city": "San Francisco",
  "units": "metric"
}`;

const weatherOutput = `{
  "temperature": 14,
  "conditions": "Foggy",
  "humidity": 0.82
}`;

export default function SubAgent() {
  return (
    <div className="mx-auto max-w-2xl p-6">
      <AgentRun state="completed" defaultOpen>
        <AgentRunHeader>
          <AgentRunTitle>Explore codebase</AgentRunTitle>
          <Status state="active" size="sm">Completed</Status>
          <AgentRunMeta>
            <span>6 steps</span>
            <span>·</span>
            <span>8.7s</span>
            <span>·</span>
            <UsageMeter size="sm" className="gap-x-2">
              <UsageStat>
                <UsageStatLabel>in</UsageStatLabel>
                <UsageStatValue>1.2k</UsageStatValue>
              </UsageStat>
              <UsageStat>
                <UsageStatLabel>out</UsageStatLabel>
                <UsageStatValue>410</UsageStatValue>
              </UsageStat>
            </UsageMeter>
          </AgentRunMeta>
        </AgentRunHeader>
        <AgentRunContent>
          <AgentRunStep>
            <AgentRunText>
              Starting with a quick scan of the project so the rest of the run
              has the right context.
            </AgentRunText>
          </AgentRunStep>

          <AgentRunStep>
            <Action defaultOpen={false}>
              <ActionTrigger>
                <ActionIcon>
                  <FolderTreeIcon />
                </ActionIcon>
                <ActionLabel>List</ActionLabel>
                <Chip size="sm">src</Chip>
              </ActionTrigger>
              <ActionContent>
                3 top level folders: components, demos, docs.
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
                Hits in every component file. The kit relies on data-slot for
                CSS targeting.
              </ActionContent>
            </Action>
          </AgentRunStep>

          <AgentRunStep>
            <AgentRunText>
              The naming for one of the components was unclear, so I pulled up
              the actual file.
            </AgentRunText>
          </AgentRunStep>

          <AgentRunStep>
            <Action defaultOpen>
              <ActionTrigger>
                <ActionIcon>
                  <FileTextIcon />
                </ActionIcon>
                <ActionLabel>Read</ActionLabel>
                <Chip size="sm">CONVENTIONS.md</Chip>
              </ActionTrigger>
              <ActionContent>
                Components carry no SDK types. Heavy renderers like Markdown and
                CodeBlock are sibling components, not internals. Each family
                lives in a single file.
              </ActionContent>
            </Action>
          </AgentRunStep>

          <AgentRunStep>
            <AgentRunText>
              The sub-agent also called a tool. Tools sit alongside actions when
              the technical detail matters.
            </AgentRunText>
          </AgentRunStep>

          <AgentRunStep>
            <Tool state="success" defaultOpen={false}>
              <ToolTrigger>
                <ToolIcon>
                  <CloudIcon />
                </ToolIcon>
                <ToolName>get_weather</ToolName>
                <ToolLabel>San Francisco</ToolLabel>
              </ToolTrigger>
              <ToolContent>
                <ToolSubtitle>Input</ToolSubtitle>
                <ToolBlock>{weatherInput}</ToolBlock>
                <ToolSubtitle>Output</ToolSubtitle>
                <ToolBlock>{weatherOutput}</ToolBlock>
              </ToolContent>
            </Tool>
          </AgentRunStep>

          <AgentRunStep>
            <AgentRunText>
              Wrapping up. The kit follows a flat copy-paste model and the new
              component will land at{" "}
              <code>src/components/ai/agent-run.tsx</code> with its demos under
              a matching folder.
            </AgentRunText>
          </AgentRunStep>
        </AgentRunContent>
      </AgentRun>
    </div>
  );
}
