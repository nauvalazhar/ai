// tested against @tanstack/ai-react@0.11.7
//
// Canonical send/stop pattern. The composer's submit button swaps to a stop
// affordance while `status === "streaming"` or `"submitted"`. Send goes through
// `useComposer().submit` so we keep the input's clear-on-submit behavior;
// stop calls `useChat().stop()` which aborts the in-flight stream.

import { useEffect, useMemo } from "react";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { useChat, type UIMessage } from "@tanstack/ai-react";
import type { ChatClientState } from "@tanstack/ai-client";
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
} from "#/components/ai/conversation";
import { Loader } from "#/components/ai/loader";
import { Message, MessageContent, MessageText } from "#/components/ai/message";
import { createMockAdapter } from "../tanstack-chat/_mock/adapter";
import { basicScript } from "../tanstack-chat/_mock/scripts";

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
        <SquareIcon className="fill-foreground" />
      </Button>
    );
  }

  return (
    <Button
      iconOnly
      type="button"
      aria-label="Send"
      data-slot="composer-submit"
      disabled={isEmpty || disabled}
      onClick={submit}
      className="rounded-full"
    >
      <ArrowUpIcon />
    </Button>
  );
}

function renderText(message: UIMessage) {
  const text = message.parts
    .map((part) => (part.type === "text" ? part.content : ""))
    .join("");
  if (!text) return null;
  return (
    <MessageText variant={message.role === "user" ? "bubble" : "plain"}>
      {text}
    </MessageText>
  );
}

export default function SendStop() {
  const connection = useMemo(() => createMockAdapter(basicScript), []);
  const { messages, sendMessage, stop, status } = useChat({ connection });
  const busy = isBusy(status);

  useEffect(() => () => stop(), [stop]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <Conversation className="flex-1 min-h-0">
        <ConversationContent className="py-8 px-2.5">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6 py-12">
            {messages.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground">
                Send a message to start a mock stream, then hit the stop button
                while the assistant is replying. The icon flips between send and
                stop based on `useChat().status`.
              </div>
            ) : (
              messages.map((m) => (
                <Message
                  key={m.id}
                  type={m.role === "user" ? "outgoing" : "incoming"}
                >
                  <MessageContent>{renderText(m)}</MessageContent>
                </Message>
              ))
            )}
            {busy && messages.at(-1)?.role === "user" && (
              <Loader variant="shimmer" dots className="px-1">
                Thinking
              </Loader>
            )}
          </div>
        </ConversationContent>
      </Conversation>
      <div className="mx-auto w-full max-w-xl py-4">
        <Composer>
          <ComposerInput
            autoFocus
            placeholder="Ask anything. Click stop while streaming to abort."
            onSubmit={(text) => {
              void sendMessage(text);
            }}
          />
          <ComposerToolbar>
            <ComposerToolbarSpacer>
              <SendOrStop status={status} onStop={stop} />
            </ComposerToolbarSpacer>
          </ComposerToolbar>
        </Composer>
      </div>
    </div>
  );
}
