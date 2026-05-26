import {
  ArrowUpIcon,
  BotIcon,
  BrainIcon,
  ChevronRightIcon,
  CloudIcon,
  CodeIcon,
  CompassIcon,
  CopyIcon,
  FileTextIcon,
  FolderTreeIcon,
  HashIcon,
  ImageIcon,
  MessageSquareIcon,
  InfoIcon,
  MicIcon,
  PauseIcon,
  PlayIcon,
  ScissorsIcon,
  SearchIcon,
  ShareIcon,
  SparklesIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  TrashIcon,
  Volume2Icon,
  XIcon,
} from "lucide-react";
import {
  AgentRun,
  AgentRunContent,
  AgentRunHeader,
  AgentRunStep,
  AgentRunText,
  AgentRunTitle,
} from "#/components/ai/agent-run";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtIcon,
  ChainOfThoughtStepStatic,
} from "#/components/ai/chain-of-thought";
import { Loader } from "#/components/ai/loader";
import {
  Action,
  ActionContent,
  ActionIcon,
  ActionLabel,
  ActionTrigger,
} from "#/components/ai/action";
import { Button } from "#/components/ai/button";
import { Chip } from "#/components/ai/chip";
import {
  Diff,
  DiffContent,
  DiffFile,
  DiffFileHeader,
  DiffFileName,
  DiffFilePanel,
  DiffLine,
  DiffStat,
  DiffWord,
} from "#/components/ai/diff";
import {
  FeedbackBar,
  FeedbackBarAction,
  FeedbackBarContent,
  FeedbackBarDismiss,
  FeedbackBarIcon,
} from "#/components/ai/feedback-bar";
import { Message, MessageContent, MessageText } from "#/components/ai/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "#/components/ai/reasoning";
import { Status } from "#/components/ai/status";
import { Suggestion } from "#/components/ai/suggestion";
import {
  Todo,
  TodoContent,
  TodoHeader,
  TodoItem,
  TodoItemIcon,
  TodoItemLabel,
  TodoList,
  TodoTitle,
} from "#/components/ai/todo";
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
  UsageBar,
  UsageMeter,
  UsageStat,
  UsageStatLabel,
  UsageStatValue,
} from "#/components/ai/usage-meter";
import { cn } from "#/lib/utils";

export function HeroShowcase() {
  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 110% 110% at 50% 50%, black 65%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 110% 110% at 50% 50%, black 65%, transparent 100%)",
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 flex w-[2400px] items-start gap-6"
        style={{
          transform: "translate(-50%, -50%) rotate(-12deg) scale(1.1)",
          transformOrigin: "50% 50%",
        }}
      >
        <ShowcaseColumn offset={-100}></ShowcaseColumn>
        <ShowcaseColumn offset={-60}>
          <CardComposer />
          <CardSelection />
          <CardUsage />
          <CardChainOfThought />
          <CardPrompt />
        </ShowcaseColumn>
        <ShowcaseColumn offset={-10}>
          <CardSuggestion />
          <CardReasoning />
          <CardPlayer />
          <CardFeedback />
          <CardConfirmation />
          <CardSandbox />
          <CardStatus />
        </ShowcaseColumn>
        <ShowcaseColumn offset={70}>
          <CardDiff />
          <CardCitation />
          <CardDocument />
          <CardMessage />
          <CardCodeBlock />
          <CardChips />
        </ShowcaseColumn>
        <ShowcaseColumn offset={150}>
          <CardTodo />
          <CardTool />
          <CardCallout />
          <CardAgentRun />
          <CardLoader />
          <CardLoader />
        </ShowcaseColumn>
        <ShowcaseColumn offset={230}>
          <CardComposer />
          <CardSelection />
          <CardUsage />
          <CardChainOfThought />
        </ShowcaseColumn>
      </div>
    </div>
  );
}

function ShowcaseColumn({
  offset,
  children,
}: {
  offset: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="flex w-[360px] shrink-0 flex-col gap-6"
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-outer bg-surface ring ring-border p-3 shadow-2xl",
        "shadow-black/15 dark:shadow-black/60",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CardMessage() {
  return (
    <Card>
      <div className="flex flex-col gap-3">
        <Message type="outgoing">
          <MessageContent>
            <MessageText variant="bubble">
              What's the difference between a list and a tuple in Python?
            </MessageText>
          </MessageContent>
        </Message>
        <Message type="incoming">
          <MessageContent>
            <MessageText>
              Lists are mutable and use square brackets. Tuples are immutable
              and use parentheses. Tuples are slightly faster.
            </MessageText>
          </MessageContent>
        </Message>
      </div>
    </Card>
  );
}

function CardTool() {
  return (
    <Tool state="success" defaultOpen>
      <ToolTrigger>
        <ToolIcon>
          <CloudIcon />
        </ToolIcon>
        <ToolName>get_weather</ToolName>
        <ToolLabel>San Francisco</ToolLabel>
      </ToolTrigger>
      <ToolContent>
        <ToolSubtitle>Output</ToolSubtitle>
        <ToolBlock>{`{
  "temperature": 14,
  "conditions": "Foggy"
}`}</ToolBlock>
      </ToolContent>
    </Tool>
  );
}

function CardReasoning() {
  return (
    <Card>
      <Reasoning defaultOpen>
        <ReasoningTrigger>Thought for 12 seconds</ReasoningTrigger>
        <ReasoningContent>
          <p>
            The user is asking about list and tuple in Python. I'll focus on
            mutability, syntax, and when to pick one.
          </p>
        </ReasoningContent>
      </Reasoning>
    </Card>
  );
}

function CardComposer() {
  return (
    <Card className="p-0">
      <div
        data-slot="composer"
        className="flex flex-col rounded-[calc(var(--radius-outer)-0.25rem)] bg-surface-elevated ring ring-border"
      >
        <div className="px-3.5 pt-3 pb-2 text-sm text-foreground">
          Summarize the meeting notes and pull out action items.
        </div>
        <div className="flex items-center gap-1 px-2 pb-2">
          <Button
            iconOnly
            variant="ghost"
            className="size-7 text-muted-foreground"
            aria-label="Attach"
          >
            <FileTextIcon />
          </Button>
          <Button
            iconOnly
            variant="ghost"
            className="size-7 text-muted-foreground"
            aria-label="Voice"
          >
            <MicIcon />
          </Button>
          <div className="flex-1" />
          <Button iconOnly className="size-7 rounded-full" aria-label="Send">
            <ArrowUpIcon />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function CardCodeBlock() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-3.5 py-2">
        <span className="font-mono text-xs text-muted-foreground">
          counter.tsx
        </span>
        <Chip size="sm">tsx</Chip>
      </div>
      <pre className="m-0 px-3.5 py-3 font-mono text-xs leading-relaxed text-foreground">
        <span className="text-muted-foreground">import</span>{" "}
        <span>{"{ useState }"}</span>{" "}
        <span className="text-muted-foreground">from</span>{" "}
        <span className="text-primary">"react"</span>;{"\n\n"}
        <span className="text-muted-foreground">export function</span>{" "}
        <span>Counter</span>() {"{"}
        {"\n  "}
        <span className="text-muted-foreground">const</span> [count, setCount] ={" "}
        <span>useState</span>(0);{"\n  "}
        <span className="text-muted-foreground">return</span> count;{"\n"}
        {"}"}
      </pre>
    </Card>
  );
}

function CardDiff() {
  return (
    <Diff className="rounded-none ring-0 bg-transparent -m-1">
      <DiffContent>
        <DiffFile>
          <DiffFileHeader>
            <DiffFileName>style.css</DiffFileName>
            <DiffStat kind="added">+2</DiffStat>
            <DiffStat kind="removed">-2</DiffStat>
          </DiffFileHeader>
          <DiffFilePanel>
            <DiffLine state="unchanged" number={1}>{`:root {`}</DiffLine>
            <DiffLine state="removed" number={2}>
              {`  --bg: `}
              <DiffWord>#111827</DiffWord>
              {`;`}
            </DiffLine>
            <DiffLine state="added" number={2}>
              {`  --bg: `}
              <DiffWord>#020617</DiffWord>
              {`;`}
            </DiffLine>
            <DiffLine state="unchanged" number={3}>{`}`}</DiffLine>
          </DiffFilePanel>
        </DiffFile>
      </DiffContent>
    </Diff>
  );
}

function CardTodo() {
  return (
    <Todo defaultOpen>
      <TodoHeader>
        <TodoTitle>Update Todos</TodoTitle>
        <span className="text-xs text-muted-foreground">2 / 5</span>
      </TodoHeader>
      <TodoContent>
        <TodoList>
          <TodoItem status="completed">
            <TodoItemIcon />
            <TodoItemLabel>Set up project structure</TodoItemLabel>
          </TodoItem>
          <TodoItem status="completed">
            <TodoItemIcon />
            <TodoItemLabel>Create main HTML page</TodoItemLabel>
          </TodoItem>
          <TodoItem status="progress">
            <TodoItemIcon />
            <TodoItemLabel>Wire up JavaScript</TodoItemLabel>
          </TodoItem>
          <TodoItem status="pending">
            <TodoItemIcon />
            <TodoItemLabel>Implement styling</TodoItemLabel>
          </TodoItem>
        </TodoList>
      </TodoContent>
    </Todo>
  );
}

function CardAgentRun() {
  return (
    <AgentRun state="completed" defaultOpen>
      <AgentRunHeader>
        <AgentRunTitle>Explore codebase</AgentRunTitle>
        <Status state="active" size="sm">
          Done
        </Status>
      </AgentRunHeader>
      <AgentRunContent>
        <AgentRunStep>
          <AgentRunText>
            Looking through the project to map where files live.
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
            <ActionContent>Found 41 components.</ActionContent>
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
            <ActionContent>Every root sets data-slot.</ActionContent>
          </Action>
        </AgentRunStep>
      </AgentRunContent>
    </AgentRun>
  );
}

function CardSuggestion() {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div className="px-1 text-xs text-muted-foreground">Try one</div>
        <div className="flex flex-wrap gap-1.5 **:text-xs">
          <Suggestion>Summarize this thread</Suggestion>
          <Suggestion>Draft a reply</Suggestion>
          <Suggestion>Extract action items</Suggestion>
          <Suggestion>Translate to French</Suggestion>
        </div>
      </div>
    </Card>
  );
}

function CardUsage() {
  return (
    <Card>
      <div className="flex flex-col gap-3 text-sm">
        <UsageMeter>
          <UsageStat>
            <UsageStatLabel>Input</UsageStatLabel>
            <UsageStatValue>1,284</UsageStatValue>
          </UsageStat>
          <UsageStat>
            <UsageStatLabel>Output</UsageStatLabel>
            <UsageStatValue>612</UsageStatValue>
          </UsageStat>
          <UsageStat>
            <UsageStatLabel>Cost</UsageStatLabel>
            <UsageStatValue>$0.0042</UsageStatValue>
          </UsageStat>
        </UsageMeter>
        <UsageBar value={1896} max={4000}>
          <span>Total</span>
          <span>1,896 / 4,000</span>
        </UsageBar>
      </div>
    </Card>
  );
}

function CardCitation() {
  return (
    <Card>
      <div className="flex flex-col gap-2.5 text-sm">
        <p className="text-foreground leading-relaxed">
          Brent crude briefly touched $98 a barrel after reports of naval
          engagements near the strait{" "}
          <span className="inline-flex items-baseline gap-0.5 rounded bg-surface-elevated px-1 py-0.5 text-xs text-muted-foreground ring ring-border">
            Reuters +2
          </span>
          .
        </p>
        <div className="rounded bg-surface-elevated ring ring-border p-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Reuters
          </div>
          <div className="mt-1 text-sm font-medium text-foreground">
            Oil prices spike as Hormuz stand-off escalates
          </div>
        </div>
      </div>
    </Card>
  );
}

function CardStatus() {
  return (
    <Card>
      <div className="flex flex-col gap-2.5">
        <div className="px-1 text-xs text-muted-foreground">Connection</div>
        <div className="flex flex-wrap gap-1.5 text-sm">
          <Status state="active">Live</Status>
          <Status state="inflight" pulse>
            Connecting
          </Status>
          <Status state="error">Failed</Status>
        </div>
      </div>
    </Card>
  );
}

function CardFeedback() {
  return (
    <FeedbackBar className="w-full">
      <FeedbackBarIcon>
        <InfoIcon />
      </FeedbackBarIcon>
      <FeedbackBarContent>Was this helpful?</FeedbackBarContent>
      <FeedbackBarAction>
        <Button iconOnly variant="ghost" aria-label="Helpful">
          <ThumbsUpIcon />
        </Button>
        <Button iconOnly variant="ghost" aria-label="Not helpful">
          <ThumbsDownIcon />
        </Button>
        <FeedbackBarDismiss
          render={
            <Button iconOnly variant="ghost" aria-label="Dismiss">
              <XIcon />
            </Button>
          }
        />
      </FeedbackBarAction>
    </FeedbackBar>
  );
}

function CardPlayer() {
  return (
    <Card>
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-1 h-12">
          {Array.from({ length: 32 }).map((_, i) => {
            const heights = [
              0.3, 0.5, 0.8, 1, 0.6, 0.4, 0.7, 0.9, 0.5, 0.3, 0.4, 0.7, 0.95,
              0.85, 0.6, 0.5, 0.4, 0.55, 0.7, 0.9, 0.6, 0.4, 0.3, 0.5, 0.7,
              0.85, 0.95, 0.7, 0.5, 0.4, 0.3, 0.45,
            ];
            const h = heights[i % heights.length];
            const active = i < 14;
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-full",
                  active ? "bg-primary" : "bg-white/7",
                )}
                style={{ height: `${h * 100}%` }}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button iconOnly variant="ghost" aria-label="Play">
            <PlayIcon />
          </Button>
          <div className="flex-1">
            <div className="font-mono text-xs tabular-nums text-muted-foreground">
              0:42 / 2:18
            </div>
            <div className="mt-1 h-1 rounded-full bg-muted">
              <div className="h-full w-1/3 rounded-full bg-primary" />
            </div>
          </div>
          <Button iconOnly variant="ghost" aria-label="Pause">
            <Volume2Icon />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function CardCallout() {
  return (
    <Card>
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-elevated ring ring-border text-primary">
          <BotIcon className="size-4" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="text-sm font-medium text-foreground">
            Ready when you are
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Ask anything about your codebase. I can read files, run searches,
            and propose diffs.
          </p>
        </div>
        <Button variant="ghost" className="-mr-1 size-7" iconOnly>
          <ChevronRightIcon />
        </Button>
      </div>
    </Card>
  );
}

function CardChainOfThought() {
  return (
    <Card>
      <ChainOfThought defaultOpen>
        <ChainOfThoughtHeader>
          <ChainOfThoughtIcon>
            <BrainIcon />
          </ChainOfThoughtIcon>
          Working through the request
        </ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          <ChainOfThoughtStepStatic>
            <ChainOfThoughtIcon />
            Analyzing the user's request
          </ChainOfThoughtStepStatic>
          <ChainOfThoughtStepStatic>
            <ChainOfThoughtIcon />
            Reviewing prior context
          </ChainOfThoughtStepStatic>
          <ChainOfThoughtStepStatic>
            <ChainOfThoughtIcon />
            Drafting the answer
          </ChainOfThoughtStepStatic>
        </ChainOfThoughtContent>
      </ChainOfThought>
    </Card>
  );
}

function CardLoader() {
  return (
    <Card>
      <div className="flex flex-col gap-3 text-sm">
        <Loader variant="pulse" dots>
          Thinking
        </Loader>
        <Loader variant="shimmer" dots>
          Searching the web
        </Loader>
        <Loader variant="shimmer">Generating response</Loader>
      </div>
    </Card>
  );
}

function CardMenu() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-3.5 pt-3 pb-2 text-xs font-medium text-muted-foreground">
        Actions
      </div>
      <div className="flex flex-col px-1.5 pb-1.5">
        {[
          { icon: CopyIcon, label: "Copy" },
          { icon: ScissorsIcon, label: "Cut" },
          { icon: ShareIcon, label: "Share" },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-foreground hover:bg-accent"
          >
            <Icon className="size-4 text-muted-foreground" />
            {label}
          </div>
        ))}
        <div className="my-1 h-px bg-border" />
        <div className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive">
          <TrashIcon className="size-4" />
          Delete
        </div>
      </div>
    </Card>
  );
}

function CardGeneratedImage() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="relative aspect-[4/3] w-full bg-surface-elevated">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--color-primary) 40%, transparent), transparent 55%), radial-gradient(circle at 75% 70%, color-mix(in oklab, var(--color-success) 35%, transparent), transparent 60%), radial-gradient(circle at 50% 90%, color-mix(in oklab, var(--color-warning) 35%, transparent), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <ImageIcon className="size-8 text-foreground/40" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-foreground">
            Sunset over a quiet harbor
          </div>
          <div className="text-xs text-muted-foreground">1024 × 768 · png</div>
        </div>
        <Chip size="sm">v3</Chip>
      </div>
    </Card>
  );
}

function CardChips() {
  return (
    <Card>
      <div className="flex flex-col gap-2.5">
        <div className="px-1 text-xs text-muted-foreground">Tags</div>
        <div className="flex flex-wrap gap-1.5">
          <Chip>refactor</Chip>
          <Chip>typescript</Chip>
          <Chip>good-first-issue</Chip>
          <Chip>needs-review</Chip>
          <Chip size="sm">in-progress</Chip>
          <Chip size="sm">priority-high</Chip>
        </div>
      </div>
    </Card>
  );
}

function CardPrompt() {
  const options = [
    { value: "Top 5 scores", selected: true },
    { value: "Recent 5 games", selected: false },
    { value: "Top 10 scores", selected: false },
  ];
  return (
    <Card>
      <div className="flex flex-col gap-3">
        <div className="text-sm font-medium text-foreground">
          What history do you want to show?
        </div>
        <div className="flex flex-col gap-1">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={cn(
                "flex items-center gap-2 rounded px-2.5 py-2 text-sm",
                opt.selected
                  ? "bg-surface ring ring-border text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-3.5 rounded-full ring",
                  opt.selected ? "bg-primary ring-primary" : "ring-border",
                )}
              />
              {opt.value}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2.5 text-xs text-muted-foreground">
          <span>ESC to dismiss</span>
          <Button className="h-7 px-2.5">Submit</Button>
        </div>
      </div>
    </Card>
  );
}

function CardConfirmation() {
  return (
    <Card>
      <div className="flex flex-col gap-3">
        <div className="text-sm font-medium text-foreground">
          Delete this conversation?
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Messages, attachments, and tool runs from this thread will be
          permanently removed. This cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="ghost" className="h-7 px-2.5">
            Cancel
          </Button>
          <Button className="h-7 px-2.5 bg-destructive">Delete</Button>
        </div>
      </div>
    </Card>
  );
}

function CardDocument() {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded bg-surface ring ring-border">
          <FileTextIcon className="size-5 text-muted-foreground" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="truncate text-sm font-medium text-foreground">
            Q3 board update
          </div>
          <div className="text-xs text-muted-foreground">
            PDF · 248 KB · 8 pages
          </div>
        </div>
        <Chip size="sm">draft</Chip>
      </div>
    </Card>
  );
}

function CardSelection() {
  const commands = [
    {
      icon: MessageSquareIcon,
      label: "Chat",
      description: "Quick assistant chat",
      highlighted: true,
    },
    { icon: CodeIcon, label: "Code review" },
    { icon: CompassIcon, label: "Feedback" },
    {
      icon: HashIcon,
      label: "MCP",
      description: "Show MCP server status",
    },
  ];
  return (
    <div className="flex flex-col gap-1 rounded-outer border border-border bg-surface p-1 shadow-2xl shadow-black/15 dark:shadow-black/60">
      <span className="text-xs font-medium text-muted-foreground px-3 pt-2 pb-1">
        Commands
      </span>
      {commands.map((cmd) => (
        <div
          key={cmd.label}
          className={cn(
            "flex items-center gap-2.5 rounded px-3 py-1.5 text-sm",
            cmd.highlighted ? "bg-accent text-foreground" : "text-foreground",
          )}
        >
          <cmd.icon className="size-4 text-muted-foreground" />
          <span>{cmd.label}</span>
          {cmd.description ? (
            <span className="truncate text-muted-foreground">
              {cmd.description}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function CardSandbox() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="size-2 rounded-full bg-success" />
        <span className="text-xs font-medium text-foreground">sandbox.py</span>
        <span className="ml-auto font-mono text-xs text-muted-foreground">
          ran in 184ms
        </span>
      </div>
      <pre className="m-0 px-3 py-2.5 font-mono text-xs leading-relaxed text-foreground">
        <span className="text-muted-foreground">{">>> "}</span>
        sum(range(100)){"\n"}
        <span className="text-primary">4950</span>
        {"\n"}
        <span className="text-muted-foreground">{">>> "}</span>
        [n*n for n in range(5)]{"\n"}
        <span className="text-primary">[0, 1, 4, 9, 16]</span>
      </pre>
    </Card>
  );
}
