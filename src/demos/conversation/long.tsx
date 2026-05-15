import { ArrowDownIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
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

const turns = [
  "Walk me through how the kit handles message bubbles.",
  "Each row is a Message with optional Avatar, Content, Text, and Action parts. Variants live on MessageText so you can mix bubble and plain segments.",
  "What's the right way to render assistant streams?",
  "Wrap streaming text in a sibling like Markdown or ResponseStream. The Message itself stays presentational, so you only pay for parsing when you render it.",
  "And actions go where?",
  "Inside MessageContent, after the text segments. MessageAction is just a layout row. Drop a Button with iconOnly and the ghost variant inside for the standard look.",
  "Can I use my own avatar component?",
  "Yes, MessageAvatar accepts any children. A direct <img> child is sized to fill the slot, anything else lays out centered.",
  "How does the Conversation manage scroll?",
  "It tracks distance from the bottom on the viewport element and exposes a context so the floating button can scroll to the latest message.",
  "What if I want a flat list with no auto-scroll?",
  "Drop ConversationScrollButton entirely and the auto-stick still works, or stop calling scrollToBottom by editing the file. The kit copies into your repo.",
  "Does it cooperate with virtualization?",
  "Not out of the box. If you need virtualization, render your own viewport via the render prop on ConversationContent. The behavior here is for moderate threads.",
  "Where do I theme the scrollbar?",
  "By default the viewport uses native scroll. Pass render on Conversation and ConversationContent to swap in a custom scroll area like Base UI's ScrollArea.",
  "Final question: does it handle reduced-motion preferences?",
  "scrollTo uses smooth by default. If a user has reduced-motion set, the browser already swaps it for instant. You can also pass behavior to scrollToBottom.",
];

export default function Long() {
  return (
    <Conversation className="absolute! inset-0">
      <ConversationContent className="py-20 px-2.5">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
          {turns.map((text, index) => {
            const outgoing = index % 2 === 0;
            return (
              <Message key={index} type={outgoing ? "outgoing" : "incoming"}>
                <MessageAvatar>{outgoing ? "N" : "AI"}</MessageAvatar>
                <MessageContent>
                  <MessageText variant={outgoing ? "bubble" : "plain"}>
                    {text}
                  </MessageText>
                </MessageContent>
              </Message>
            );
          })}
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
