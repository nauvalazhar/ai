// tested against @tanstack/ai@0.21.3

import { EventType, type StreamChunk } from "@tanstack/ai";
import type { UIMessage } from "@tanstack/ai-react";
import type { BuildScriptArgs, ScriptStep } from "./adapter";

const TEXT_DELAY = 28;
const THINK_DELAY = 90;
const BEAT = 320;
const THINK_LEAD = 900;
const TOOL_LEAD = 600;

function tokens(text: string, size = 6): Array<string> {
  const out: Array<string> = [];
  for (let i = 0; i < text.length; i += size) out.push(text.slice(i, i + size));
  return out;
}

function streamText(messageId: string, text: string): Array<ScriptStep> {
  const steps: Array<ScriptStep> = [
    { type: EventType.TEXT_MESSAGE_START, messageId, role: "assistant" },
  ];
  for (const delta of tokens(text)) {
    steps.push({ type: EventType.TEXT_MESSAGE_CONTENT, messageId, delta });
    steps.push({ delay: TEXT_DELAY });
  }
  steps.push({ type: EventType.TEXT_MESSAGE_END, messageId });
  return steps as Array<ScriptStep>;
}

function streamReasoning(messageId: string, text: string): Array<ScriptStep> {
  const steps: Array<ScriptStep> = [
    { type: EventType.REASONING_START, messageId },
    { type: EventType.REASONING_MESSAGE_START, messageId, role: "reasoning" },
  ] as Array<ScriptStep>;
  for (const delta of tokens(text, 10)) {
    steps.push({ type: EventType.REASONING_MESSAGE_CONTENT, messageId, delta });
    steps.push({ delay: THINK_DELAY });
  }
  steps.push({ type: EventType.REASONING_MESSAGE_END, messageId });
  steps.push({ type: EventType.REASONING_END, messageId });
  return steps;
}

function streamToolCall(
  parentMessageId: string,
  toolCallId: string,
  toolCallName: string,
  argsJson: string,
): Array<ScriptStep> {
  const steps: Array<ScriptStep> = [
    {
      type: EventType.TOOL_CALL_START,
      toolCallId,
      toolCallName,
      parentMessageId,
    } as StreamChunk,
  ];
  for (const delta of tokens(argsJson, 5)) {
    steps.push({ type: EventType.TOOL_CALL_ARGS, toolCallId, delta } as StreamChunk);
    steps.push({ delay: TEXT_DELAY });
  }
  steps.push({ type: EventType.TOOL_CALL_END, toolCallId } as StreamChunk);
  return steps;
}

export function basicScript({ runContext }: BuildScriptArgs): Array<ScriptStep> {
  const threadId = runContext?.threadId ?? "thread_demo";
  const runId = runContext?.runId ?? "run_demo";
  const messageId = "msg_assistant_1";
  const toolCallId = "tc_weather_1";

  return [
    { type: EventType.RUN_STARTED, threadId, runId } as StreamChunk,
    { delay: THINK_LEAD },

    ...streamReasoning(
      messageId,
      "The user is asking about Tokyo. I should call the weather tool with the city name and metric units, then summarize the result in plain language.",
    ),
    { delay: BEAT },

    ...streamText(
      messageId,
      "Sure, let me pull the current weather for you.",
    ),
    { delay: TOOL_LEAD },

    ...streamToolCall(
      messageId,
      toolCallId,
      "get_weather",
      JSON.stringify({ city: "Tokyo", units: "metric" }),
    ),
    { delay: BEAT },

    {
      type: EventType.TOOL_CALL_RESULT,
      toolCallId,
      messageId: `${messageId}_tr`,
      content: JSON.stringify({
        city: "Tokyo",
        temperature: 22,
        units: "C",
        conditions: "Partly cloudy",
      }),
      role: "tool",
    } as StreamChunk,
    { delay: BEAT },

    ...streamText(
      messageId,
      "Tokyo is 22°C and partly cloudy right now. Light jacket weather.",
    ),

    {
      type: EventType.RUN_FINISHED,
      threadId,
      runId,
      finishReason: "stop",
    } as StreamChunk,
  ];
}

type ApprovalToolCall = {
  id: string;
  approval?: { id: string; needsApproval: boolean; approved?: boolean };
};

function findApprovalCall(
  messages: ReadonlyArray<UIMessage>,
  toolCallId: string,
): ApprovalToolCall | undefined {
  for (const m of messages) {
    for (const part of m.parts) {
      if (part.type === "tool-call" && part.id === toolCallId) {
        return part as ApprovalToolCall;
      }
    }
  }
  return undefined;
}

function hasToolResult(
  messages: ReadonlyArray<UIMessage>,
  toolCallId: string,
): boolean {
  for (const m of messages) {
    for (const part of m.parts) {
      if (part.type === "tool-result" && part.toolCallId === toolCallId) {
        return true;
      }
    }
  }
  return false;
}

export function withApprovalScript({
  messages,
  runContext,
}: BuildScriptArgs): Array<ScriptStep> {
  const threadId = runContext?.threadId ?? "thread_demo";
  const runId = runContext?.runId ?? "run_demo";
  const messageId = "msg_assistant_1";
  const toolCallId = "tc_write_1";
  const approvalId = "ap_write_1";

  const prior = findApprovalCall(messages, toolCallId);
  const haveResult = hasToolResult(messages, toolCallId);

  if (prior?.approval?.approved === true && !haveResult) {
    return [
      { type: EventType.RUN_STARTED, threadId, runId } as StreamChunk,
      {
        type: EventType.RUN_FINISHED,
        threadId,
        runId,
        finishReason: "stop",
      } as StreamChunk,
    ];
  }

  if (prior?.approval?.approved === true && haveResult) {
    return [
      { type: EventType.RUN_STARTED, threadId, runId } as StreamChunk,
      { delay: BEAT },
      ...streamText(
        messageId,
        "Done. Wrote 248 bytes to notes/draft.md.",
      ),
      {
        type: EventType.RUN_FINISHED,
        threadId,
        runId,
        finishReason: "stop",
      } as StreamChunk,
    ];
  }

  if (prior?.approval?.approved === false) {
    return [
      { type: EventType.RUN_STARTED, threadId, runId } as StreamChunk,
      { delay: BEAT },
      ...streamText(
        messageId,
        "No problem. I'll leave the file alone.",
      ),
      {
        type: EventType.RUN_FINISHED,
        threadId,
        runId,
        finishReason: "stop",
      } as StreamChunk,
    ];
  }

  return [
    { type: EventType.RUN_STARTED, threadId, runId } as StreamChunk,
    { delay: THINK_LEAD },

    ...streamText(
      messageId,
      "I'll write that draft for you. One moment.",
    ),
    { delay: TOOL_LEAD },

    ...streamToolCall(
      messageId,
      toolCallId,
      "write_file",
      JSON.stringify({
        path: "notes/draft.md",
        content: "# Meeting notes\n\n- ship the bridge\n- write the docs",
      }),
    ),
    { delay: BEAT },

    {
      type: EventType.CUSTOM,
      name: "approval-requested",
      value: {
        toolCallId,
        toolName: "write_file",
        input: { path: "notes/draft.md" },
        approval: { id: approvalId, needsApproval: true },
      },
    } as StreamChunk,

    {
      type: EventType.RUN_FINISHED,
      threadId,
      runId,
      finishReason: "stop",
    } as StreamChunk,
  ];
}
