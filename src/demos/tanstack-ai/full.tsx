// tested against @tanstack/ai-react@0.11.7
//
// The full canonical chat demo. One useChat against a mock adapter, a single
// renderPart switch that dispatches every TanStack part type to the right
// aikit component: streaming markdown, auto-collapsing thinking, an
// auto-approved weather tool, a generated-image tool with state transitions,
// and a file-write tool wired to <Confirmation>. Copy this file and edit.

import { useEffect, useMemo, useRef } from "react";
import {
  ArrowDownIcon,
  CloudSunIcon,
  FileCheck2Icon,
  FilePenIcon,
} from "lucide-react";
import { useChat, type UIMessage } from "@tanstack/ai-react";
import type { MessagePart } from "@tanstack/ai-client";
import { Button } from "#/components/ai/button";
import {
  Confirmation,
  ConfirmationAccept,
  ConfirmationAction,
  ConfirmationApproved,
  ConfirmationDescription,
  ConfirmationHeader,
  ConfirmationIcon,
  ConfirmationPending,
  ConfirmationReject,
  ConfirmationRejected,
  ConfirmationStatus,
  ConfirmationTitle,
} from "#/components/ai/confirmation";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "#/components/ai/conversation";
import {
  GeneratedImage,
  GeneratedImageHeader,
  GeneratedImageLoading,
  GeneratedImageOverlay,
  GeneratedImagePlaceholder,
  GeneratedImageProgress,
  GeneratedImageTitle,
} from "#/components/ai/generated-image";
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
  ToolIcon,
  ToolLabel,
  ToolName,
  ToolSubtitle,
  ToolTrigger,
} from "#/components/ai/tool";
import { createMockAdapter } from "./_mock/adapter";
import { canonicalScript } from "./_mock/scripts";

type Part = MessagePart;
type ToolCallPart = Extract<Part, { type: "tool-call" }>;
type ToolResultPart = Extract<Part, { type: "tool-result" }>;
type ToolStateName = "pending" | "approval" | "running" | "success" | "error";

type RenderContext = {
  role: UIMessage["role"];
  parts: Array<Part>;
  index: number;
  onApprove: (id: string, call: ToolCallPart) => void;
  onReject: (id: string) => void;
};

function findResult(parts: Array<Part>, callId: string) {
  return parts.find(
    (p): p is ToolResultPart =>
      p.type === "tool-result" && p.toolCallId === callId,
  );
}

function mapToolState(
  call: ToolCallPart,
  result: ToolResultPart | undefined,
): ToolStateName {
  if (call.approval?.needsApproval && call.approval.approved === undefined) {
    return "approval";
  }
  if (call.approval?.approved === false && !result) return "error";
  if (result?.state === "error") return "error";
  if (result?.state === "complete") return "success";
  if (result?.state === "streaming") return "running";
  if (call.approval?.approved === true && !result) return "running";
  if (call.state === "complete") return "success";
  return "pending";
}

function parseImageUrl(raw: string | undefined) {
  if (!raw) return undefined;
  try {
    return (JSON.parse(raw) as { url?: string }).url;
  } catch {
    return undefined;
  }
}

function mapImageState(
  call: ToolCallPart,
  result: ToolResultPart | undefined,
): "queued" | "generating" | "complete" | "error" {
  if (result?.state === "error") return "error";
  if (result?.state === "complete") {
    return parseImageUrl(result.content) ? "complete" : "error";
  }
  if (call.state === "awaiting-input") return "queued";
  return "generating";
}

function ThinkingPart({ content, collapse }: { content: string; collapse: boolean }) {
  return (
    <Reasoning defaultOpen={!collapse}>
      <ReasoningTrigger>
        {collapse ? "Thought for a moment" : <Loader variant="shimmer">Thinking</Loader>}
      </ReasoningTrigger>
      <ReasoningContent>{content}</ReasoningContent>
    </Reasoning>
  );
}

function ImageGenPart({ part, ctx }: { part: ToolCallPart; ctx: RenderContext }) {
  const result = findResult(ctx.parts, part.id);
  const url = parseImageUrl(result?.content);
  return (
    <GeneratedImage state={mapImageState(part, result)} aspectRatio="video">
      {url && (
        <img data-slot="generated-image-content" src={url} alt="Generated cover" />
      )}
      <GeneratedImageLoading />
      <GeneratedImageHeader>
        <GeneratedImagePlaceholder>
          <GeneratedImageTitle>Queued</GeneratedImageTitle>
          <div className="text-xs text-muted-foreground">Waiting for a slot</div>
        </GeneratedImagePlaceholder>
        <GeneratedImageProgress>
          <GeneratedImageTitle>Generating</GeneratedImageTitle>
          <div className="text-xs text-white/70">A Tokyo skyline at dusk</div>
        </GeneratedImageProgress>
      </GeneratedImageHeader>
      <GeneratedImageOverlay />
    </GeneratedImage>
  );
}

function ToolPart({ part, ctx }: { part: ToolCallPart; ctx: RenderContext }) {
  const result = findResult(ctx.parts, part.id);
  const state = mapToolState(part, result);
  const needsApproval = part.name === "write_file";
  const argState =
    part.state === "input-streaming" || part.state === "awaiting-input"
      ? ("streaming" as const)
      : ("complete" as const);
  const approval = part.approval;
  const Icon = needsApproval ? FilePenIcon : CloudSunIcon;

  return (
    <Tool state={state} defaultOpen>
      <ToolTrigger>
        <ToolIcon>
          <Icon />
        </ToolIcon>
        <ToolName>{part.name}</ToolName>
        <ToolLabel>{state === "approval" ? "needs approval" : state}</ToolLabel>
      </ToolTrigger>
      <ToolContent>
        <ToolSubtitle>Input</ToolSubtitle>
        <ToolArgument value={part.arguments} state={argState} />
        {needsApproval && approval?.needsApproval && (
          <Confirmation
            state={
              approval.approved === true
                ? "approved"
                : approval.approved === false
                  ? "rejected"
                  : "pending"
            }
            onStateChange={(next) => {
              if (next === "approved") ctx.onApprove(approval.id, part);
              if (next === "rejected") ctx.onReject(approval.id);
            }}
          >
            <ConfirmationHeader>
              <ConfirmationIcon>
                <FileCheck2Icon />
              </ConfirmationIcon>
              <ConfirmationTitle>Write to notes/tokyo-packing.md?</ConfirmationTitle>
            </ConfirmationHeader>
            <ConfirmationDescription>
              This will create the file in your workspace and overwrite any
              existing contents.
            </ConfirmationDescription>
            <ConfirmationPending>
              <ConfirmationAction>
                <ConfirmationReject render={<Button variant="ghost">Cancel</Button>} />
                <ConfirmationAccept render={<Button>Write</Button>} />
              </ConfirmationAction>
            </ConfirmationPending>
            <ConfirmationApproved>
              <ConfirmationStatus>Approved. Writing file.</ConfirmationStatus>
            </ConfirmationApproved>
            <ConfirmationRejected>
              <ConfirmationStatus>Cancelled by you.</ConfirmationStatus>
            </ConfirmationRejected>
          </Confirmation>
        )}
        {result?.content && (
          <>
            <ToolSubtitle>Output</ToolSubtitle>
            <ToolBlock>{result.content}</ToolBlock>
          </>
        )}
      </ToolContent>
    </Tool>
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

    case "tool-call":
      if (part.name === "generate_image") return <ImageGenPart part={part} ctx={ctx} />;
      return <ToolPart part={part} ctx={ctx} />;

    default:
      return null;
  }
}

export default function Full() {
  const connection = useMemo(() => createMockAdapter(canonicalScript), []);
  const { messages, sendMessage, addToolApprovalResponse, addToolResult } =
    useChat({ connection });

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    void sendMessage(
      "Plan a weekend in Tokyo, pull a cover image, and write me a packing list.",
    );
  }, [sendMessage]);

  const onApprove = async (id: string, call: ToolCallPart) => {
    await addToolApprovalResponse({ id, approved: true });
    await new Promise((r) => setTimeout(r, 1400));
    await addToolResult({
      toolCallId: call.id,
      tool: call.name,
      output: { bytesWritten: 248, path: "notes/tokyo-packing.md" },
    });
  };

  const onReject = (id: string) => {
    void addToolApprovalResponse({ id, approved: false });
  };

  return (
    <Conversation className="absolute! inset-0">
      <ConversationContent className="py-20 px-2.5">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
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
                      onApprove,
                      onReject,
                    })}
                  </div>
                ))}
              </MessageContent>
            </Message>
          ))}
        </div>
      </ConversationContent>
      <ConversationScrollButton
        render={
          <Button
            iconOnly
            variant="outline"
            className="absolute bottom-4 right-1/2 -translate-x-1/2 z-10 size-9 rounded-full bg-surface-elevated shadow-md transition-all data-[at-bottom=true]:pointer-events-none data-[at-bottom=true]:translate-y-1 data-[at-bottom=true]:opacity-0"
          />
        }
      >
        <ArrowDownIcon />
      </ConversationScrollButton>
    </Conversation>
  );
}
