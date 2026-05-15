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
import { ScrollArea } from "#/components/ai/scroll-area";

const turns = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  type: i % 2 === 0 ? ("outgoing" as const) : ("incoming" as const),
  text:
    i % 2 === 0
      ? `Question ${Math.floor(i / 2) + 1}: keep going?`
      : `Reply ${Math.floor(i / 2) + 1}: yes, here is one more line of context.`,
}));

export default function ScrollAreaDemo() {
  return (
    <Conversation className="absolute! inset-0">
      <ConversationContent
        className="px-2.5"
        render={<ScrollArea scrollbar="vertical" />}
      >
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 py-20">
          {turns.map((turn) => (
            <Message key={turn.id} type={turn.type}>
              <MessageAvatar>
                {turn.type === "outgoing" ? "N" : "AI"}
              </MessageAvatar>
              <MessageContent>
                <MessageText
                  variant={turn.type === "outgoing" ? "bubble" : "plain"}
                >
                  {turn.text}
                </MessageText>
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
