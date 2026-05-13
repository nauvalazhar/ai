import { ChevronDownIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  useConversation,
} from "#/components/ai/conversation";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageText,
} from "#/components/ai/message";

const turns = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  type: i % 2 === 0 ? ("outgoing" as const) : ("incoming" as const),
  text:
    i % 2 === 0
      ? `Question ${Math.floor(i / 2) + 1}: anything to add here?`
      : `Reply ${Math.floor(i / 2) + 1}: yes, here is one more line of context for you.`,
}));

function JumpToLatest() {
  const { isAtBottom, scrollToBottom } = useConversation();
  return (
    <button
      type="button"
      data-at-bottom={isAtBottom ? "true" : "false"}
      onClick={() => scrollToBottom()}
      className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-md transition-all duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary data-[at-bottom=true]:pointer-events-none data-[at-bottom=true]:translate-y-1 data-[at-bottom=true]:opacity-0 cursor-pointer"
    >
      <ChevronDownIcon className="size-3.5" aria-hidden />
      Jump to latest
    </button>
  );
}

export default function CustomButton() {
  return (
    <Conversation className="absolute! inset-0">
      <ConversationContent className="py-20 px-2.5">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
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
      <JumpToLatest />
    </Conversation>
  );
}
