// tested against @tanstack/ai-react@0.11.7
//
// Canonical wiring: a tool-call with `approval.needsApproval` renders
// `<Tool state="approval">` with a controlled `<Confirmation>` inside
// `<ToolContent>`. The chat client's `addToolApprovalResponse` is the only
// place state changes — `<Confirmation>` mirrors that via the `state` prop.

import { ArrowDownIcon, FileCheck2Icon, FilePenIcon } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
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
import { Message, MessageContent, MessageText } from "#/components/ai/message";
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
import { createMockAdapter } from "../tanstack-chat/_mock/adapter";
import { withApprovalScript } from "../tanstack-chat/_mock/scripts";

type Part = MessagePart;
type ToolCallPart = Extract<Part, { type: "tool-call" }>;
type ToolResultPart = Extract<Part, { type: "tool-result" }>;

type ToolStateName = "pending" | "approval" | "running" | "success" | "error";

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

function approvalToConfirmationState(
  call: ToolCallPart,
): "pending" | "approved" | "rejected" {
  if (call.approval?.approved === true) return "approved";
  if (call.approval?.approved === false) return "rejected";
  return "pending";
}

export default function StreamingApproval() {
  const connection = useMemo(() => createMockAdapter(withApprovalScript), []);
  const { messages, sendMessage, addToolApprovalResponse, addToolResult } =
    useChat({ connection });

  const firedRef = useRef(false);
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    void sendMessage("Save those meeting notes to notes/draft.md.");
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
              <MessageContent>
                {m.parts.map((part, index) => (
                  <PartView
                    key={index}
                    part={part}
                    parts={m.parts}
                    role={m.role}
                    onApprove={async (id, call) => {
                      await addToolApprovalResponse({ id, approved: true });
                      await new Promise((r) => setTimeout(r, 1800));
                      await addToolResult({
                        toolCallId: call.id,
                        tool: call.name,
                        output: {
                          bytesWritten: 248,
                          path: "notes/draft.md",
                        },
                      });
                    }}
                    onReject={(id) =>
                      addToolApprovalResponse({ id, approved: false })
                    }
                  />
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

function PartView({
  part,
  parts,
  role,
  onApprove,
  onReject,
}: {
  part: Part;
  parts: Array<Part>;
  role: UIMessage["role"];
  onApprove: (id: string, call: ToolCallPart) => void;
  onReject: (id: string) => void;
}) {
  if (part.type === "text") {
    return (
      <MessageText variant={role === "user" ? "bubble" : "plain"}>
        {part.content}
      </MessageText>
    );
  }

  if (part.type === "tool-call") {
    const result = findResult(parts, part.id);
    const state = mapToolState(part, result);
    const argState =
      part.state === "input-streaming" || part.state === "awaiting-input"
        ? ("streaming" as const)
        : ("complete" as const);
    const approval = part.approval;
    const showApproval = approval?.needsApproval === true;
    const confirmationState = approvalToConfirmationState(part);
    const labelByState: Record<ToolStateName, string> = {
      pending: "preparing",
      approval: "waiting for approval",
      running: "writing",
      success: "wrote 248 bytes",
      error: "cancelled",
    };

    return (
      <Tool state={state} defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <FilePenIcon />
          </ToolIcon>
          <ToolName>{part.name}</ToolName>
          <ToolLabel>{labelByState[state]}</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolArgument value={part.arguments} state={argState} />

          {showApproval && approval && (
            <Confirmation
              state={confirmationState}
              tone="default"
              onStateChange={(next) => {
                if (next === "approved") onApprove(approval.id, part);
                if (next === "rejected") onReject(approval.id);
              }}
            >
              <ConfirmationHeader>
                <ConfirmationIcon>
                  <FileCheck2Icon />
                </ConfirmationIcon>
                <ConfirmationTitle>Write to notes/draft.md?</ConfirmationTitle>
              </ConfirmationHeader>
              <ConfirmationDescription>
                This will create the file in your workspace and overwrite any
                existing contents.
              </ConfirmationDescription>

              <ConfirmationPending>
                <ConfirmationAction>
                  <ConfirmationReject
                    render={<Button variant="ghost">Cancel</Button>}
                  />
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

          {result?.error && <ToolError>{result.error}</ToolError>}
        </ToolContent>
      </Tool>
    );
  }

  return null;
}
