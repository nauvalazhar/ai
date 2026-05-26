// tested against @tanstack/ai-react@0.11.7
//
// Real wire-up against a Claude endpoint at /api/tanstack-ai-chat. The
// connection is `fetchServerSentEvents`, which posts the AG-UI RunAgentInput
// and parses the SSE stream the route returns. Same renderPart switch as
// the mock demos — proof that the bridge is adapter-agnostic.

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  InfoIcon,
  LogOutIcon,
  SquareIcon,
  WrenchIcon,
} from "lucide-react";
import { useChat, type UIMessage } from "@tanstack/ai-react";
import {
  fetchServerSentEvents,
  type ChatClientState,
  type MessagePart,
} from "@tanstack/ai-client";
import { Button } from "#/components/ai/button";
import {
  Composer,
  ComposerInput,
  ComposerToolbar,
  ComposerToolbarSpacer,
  useComposer,
} from "#/components/ai/composer";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  useConversation,
} from "#/components/ai/conversation";
import { Loader } from "#/components/ai/loader";
import { Markdown } from "#/components/ai/markdown";
import { Message, MessageContent, MessageText } from "#/components/ai/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "#/components/ai/reasoning";
import {
  Tool,
  ToolArgument,
  ToolBlock,
  ToolContent,
  ToolError,
  ToolIcon,
  ToolLabel,
  ToolName,
  ToolSubtitle,
  ToolTrigger,
} from "#/components/ai/tool";

type Part = MessagePart;
type ToolCallPart = Extract<Part, { type: "tool-call" }>;
type ToolResultPart = Extract<Part, { type: "tool-result" }>;

type RenderContext = {
  role: UIMessage["role"];
  parts: Array<Part>;
  index: number;
};

function findResult(
  parts: Array<Part>,
  callId: string,
): ToolResultPart | undefined {
  return parts.find(
    (p): p is ToolResultPart =>
      p.type === "tool-result" && p.toolCallId === callId,
  );
}

function mapToolState(
  call: ToolCallPart,
  result: ToolResultPart | undefined,
): "pending" | "approval" | "running" | "success" | "error" {
  if (call.approval?.needsApproval && call.approval.approved === undefined) {
    return "approval";
  }
  if (result?.state === "error") return "error";
  if (result?.state === "complete") return "success";
  if (result?.state === "streaming") return "running";
  if (
    call.state === "awaiting-input" ||
    call.state === "input-streaming" ||
    call.state === "input-complete"
  ) {
    return "pending";
  }
  if (call.state === "complete") return "success";
  return "running";
}

function ThinkingPart({
  content,
  collapse,
}: {
  content: string;
  collapse: boolean;
}) {
  return (
    <Reasoning defaultOpen={!collapse}>
      <ReasoningTrigger>
        {collapse ? (
          "Thought for a moment"
        ) : (
          <Loader variant="shimmer">Thinking</Loader>
        )}
      </ReasoningTrigger>
      <ReasoningContent>{content}</ReasoningContent>
    </Reasoning>
  );
}

function renderPart(part: Part, ctx: RenderContext): React.ReactNode {
  switch (part.type) {
    case "text":
      if (ctx.role === "user") {
        return <MessageText variant="bubble">{part.content}</MessageText>;
      }
      return <Markdown>{part.content}</Markdown>;

    case "thinking": {
      const collapse = ctx.parts
        .slice(ctx.index + 1)
        .some((p) => p.type === "text" || p.type === "tool-call");
      return <ThinkingPart content={part.content} collapse={collapse} />;
    }

    case "tool-call": {
      const result = findResult(ctx.parts, part.id);
      const state = mapToolState(part, result);
      const argState =
        part.state === "input-streaming" || part.state === "awaiting-input"
          ? ("streaming" as const)
          : ("complete" as const);
      return (
        <Tool state={state} defaultOpen>
          <ToolTrigger>
            <ToolIcon>
              <WrenchIcon />
            </ToolIcon>
            <ToolName>{part.name}</ToolName>
            <ToolLabel>{state}</ToolLabel>
          </ToolTrigger>
          <ToolContent>
            <ToolSubtitle>Input</ToolSubtitle>
            <ToolArgument value={part.arguments} state={argState} />
            {result?.content && (
              <>
                <ToolSubtitle>Output</ToolSubtitle>
                <ToolBlock>{result.content}</ToolBlock>
              </>
            )}
            {result?.error && <ToolError>{result.error}</ToolError>}
          </ToolContent>
        </Tool>
      );
    }

    default:
      return null;
  }
}

function isBusy(status: ChatClientState) {
  return status === "streaming" || status === "submitted";
}

function SendOrStop({
  status,
  onStop,
}: {
  status: ChatClientState;
  onStop: () => void;
}) {
  const { isEmpty, disabled, submit } = useComposer();
  const busy = isBusy(status);

  if (busy) {
    return (
      <Button
        iconOnly
        type="button"
        aria-label="Stop"
        data-slot="composer-submit"
        onClick={onStop}
        className="rounded-full"
      >
        <SquareIcon />
      </Button>
    );
  }
  return (
    <Button
      iconOnly
      type="button"
      aria-label="Send"
      data-slot="composer-submit"
      disabled={disabled || isEmpty}
      onClick={() => submit()}
      className="rounded-full"
    >
      <ArrowUpIcon />
    </Button>
  );
}

function ChatComposer({
  status,
  onSend,
  onStop,
  onHeightChange,
}: {
  status: ChatClientState;
  onSend: (text: string) => void;
  onStop: () => void;
  onHeightChange: (height: number) => void;
}) {
  const { scrollToBottom } = useConversation();
  return (
    <Composer onHeightChange={onHeightChange}>
      <ComposerInput
        placeholder="Ask Claude anything."
        onSubmit={(text) => {
          onSend(text);
          requestAnimationFrame(() => scrollToBottom());
        }}
      />
      <ComposerToolbar>
        <ComposerToolbarSpacer>
          <SendOrStop status={status} onStop={onStop} />
        </ComposerToolbarSpacer>
      </ComposerToolbar>
    </Composer>
  );
}

function Welcome({ onSaved }: { onSaved: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          setError(null);
          try {
            const res = await fetch("/api/tanstack-ai-key", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ apiKey: value.trim() }),
            });
            if (!res.ok) {
              setError(await res.text());
              return;
            }
            onSaved();
          } finally {
            setSaving(false);
          }
        }}
        className="flex w-full max-w-md flex-col gap-4 rounded-outer border border-border bg-surface p-4 shadow-sm"
      >
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm font-medium">
            Bring your own Anthropic API key
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Get a key from console.anthropic.com. You can clear it any time
            using the sign-out button.
          </p>
        </div>
        <div className="flex gap-1.5">
          <input
            type="password"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="sk-ant-..."
            className="rounded border border-border bg-surface px-3 py-1 h-7.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/40 flex-1"
          />
          <Button type="submit" disabled={!value.trim() || saving}>
            {saving ? "Saving" : "Continue"}
          </Button>
        </div>
        {error && <div className="text-xs text-destructive">{error}</div>}
        <p className="text-xs leading-relaxed text-muted-foreground flex gap-2">
          <InfoIcon className="w-4 shrink-0" />
          Your key is stored in an httpOnly cookie on this origin. The browser
          sends it back on every chat request.
        </p>
      </form>
    </div>
  );
}

export default function Real() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    void fetch("/api/tanstack-ai-key")
      .then((r) => r.json() as Promise<{ hasKey: boolean }>)
      .then((d) => setHasKey(d.hasKey))
      .catch(() => setHasKey(false));
  }, []);

  if (hasKey === null) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader variant="shimmer">Loading</Loader>
      </div>
    );
  }

  if (!hasKey) return <Welcome onSaved={() => setHasKey(true)} />;

  return <Chat onSignOut={() => setHasKey(false)} />;
}

function Chat({ onSignOut }: { onSignOut: () => void }) {
  const connection = useMemo(
    () => fetchServerSentEvents("/api/tanstack-ai-chat"),
    [],
  );
  const { messages, sendMessage, stop, status } = useChat({ connection });
  const [composerH, setComposerH] = useState(0);
  const gap = 16;

  async function signOut() {
    await fetch("/api/tanstack-ai-key", { method: "DELETE" });
    onSignOut();
  }

  return (
    <Conversation className="absolute inset-0">
      <ConversationContent
        className="px-2.5 pt-20"
        style={{ paddingBottom: composerH + gap * 2 }}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              Send a message to start a real Claude conversation.
            </p>
          )}
          {messages.map((m) => (
            <Message
              key={m.id}
              type={m.role === "user" ? "outgoing" : "incoming"}
            >
              <MessageContent>
                {m.parts.map((part, index) => (
                  <div key={index} className="contents">
                    {renderPart(part, {
                      role: m.role,
                      parts: m.parts,
                      index,
                    })}
                  </div>
                ))}
              </MessageContent>
            </Message>
          ))}
        </div>
      </ConversationContent>
      <Button
        iconOnly
        variant="outline"
        aria-label="Clear API key"
        onClick={signOut}
        className="absolute right-3 top-3 z-20 size-9 rounded-full bg-surface-elevated shadow-sm"
      >
        <LogOutIcon />
      </Button>
      <ConversationScrollButton
        render={
          <Button
            iconOnly
            variant="outline"
            style={{ bottom: composerH + gap + 12 }}
            className="absolute left-1/2 -translate-x-1/2 z-10 rounded-full bg-surface-elevated shadow-md transition-all data-[at-bottom=true]:pointer-events-none data-[at-bottom=true]:translate-y-1 data-[at-bottom=true]:opacity-0"
          />
        }
      >
        <ArrowDownIcon />
      </ConversationScrollButton>
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 w-full max-w-xl max-sm:px-2.5"
        style={{ bottom: gap }}
      >
        <ChatComposer
          status={status}
          onSend={(text) => void sendMessage(text)}
          onStop={stop}
          onHeightChange={setComposerH}
        />
      </div>
    </Conversation>
  );
}
