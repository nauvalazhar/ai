// tested against @tanstack/ai-react@0.11.7
//
// The bridge: a single `switch (part.type)` that turns a TanStack
// `UIMessage.parts` array into aikit components. This file is the canonical
// "user code" — copy it, edit it, own it.

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDownIcon, WrenchIcon } from "lucide-react";
import { useChat, type UIMessage } from "@tanstack/ai-react";
import type { MessagePart } from "@tanstack/ai-client";
import { Button } from "#/components/ai/button";
import { Loader } from "#/components/ai/loader";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockTitle,
} from "#/components/ai/code-block";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "#/components/ai/conversation";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageText,
} from "#/components/ai/message";
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
import { createMockAdapter } from "./_mock/adapter";
import { basicScript } from "./_mock/scripts";

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
  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (collapse) setOpen(false);
  }, [collapse]);
  const thinking = !collapse;
  return (
    <Reasoning open={open} onOpenChange={setOpen}>
      <ReasoningTrigger>
        {thinking ? <Loader variant="shimmer">Thinking</Loader> : "Thinking"}
      </ReasoningTrigger>
      <ReasoningContent>{content}</ReasoningContent>
    </Reasoning>
  );
}

function MediaPart({
  part,
}: {
  part: Extract<Part, { type: "image" | "audio" | "video" | "document" }>;
}) {
  const src = part.source.value;
  const label = part.source.mimeType ?? part.type;
  if (part.type === "image") {
    return (
      <img
        src={src}
        alt={label}
        className="max-w-sm rounded-md ring ring-border"
      />
    );
  }
  if (part.type === "audio") {
    return <audio src={src} controls className="w-full max-w-sm" />;
  }
  if (part.type === "video") {
    return (
      <video
        src={src}
        controls
        className="max-w-sm rounded-md ring ring-border"
      />
    );
  }
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-primary underline underline-offset-2"
    >
      {label}
    </a>
  );
}

function renderPart(part: Part, ctx: RenderContext): React.ReactNode {
  switch (part.type) {
    case "text":
      return (
        <MessageText variant={ctx.role === "user" ? "bubble" : "plain"}>
          {part.content}
        </MessageText>
      );

    case "thinking": {
      const hasLaterContent = ctx.parts
        .slice(ctx.index + 1)
        .some((p) => p.type === "text" || p.type === "tool-call");
      return <ThinkingPart content={part.content} collapse={hasLaterContent} />;
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

    case "tool-result":
      return null;

    case "image":
    case "audio":
    case "video":
    case "document":
      return <MediaPart part={part} />;

    case "structured-output":
      return (
        <CodeBlock>
          <CodeBlockHeader>
            <CodeBlockTitle>
              structured-output
              {part.status === "streaming" ? " (streaming)" : ""}
            </CodeBlockTitle>
          </CodeBlockHeader>
          <CodeBlockContent>
            <pre className="whitespace-pre-wrap wrap-break-word">
              {part.raw}
            </pre>
          </CodeBlockContent>
        </CodeBlock>
      );
  }
}

export default function Basic() {
  const connection = useMemo(() => createMockAdapter(basicScript), []);
  const { messages, sendMessage } = useChat({ connection });

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    void sendMessage("What's the weather in Tokyo?");
  }, [sendMessage]);

  return (
    <Conversation className="absolute! inset-0">
      <ConversationContent className="py-20 px-2.5">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
          {messages.map((m) => (
            <Message
              key={m.id}
              type={m.role === "user" ? "outgoing" : "incoming"}
            >
              <MessageAvatar>{m.role === "user" ? "N" : "AI"}</MessageAvatar>
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
