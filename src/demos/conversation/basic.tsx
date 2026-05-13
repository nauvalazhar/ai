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

export default function Basic() {
  return (
    <Conversation className="absolute! inset-0">
      <ConversationContent className="py-20 px-2.5">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
          <Message type="outgoing">
            <MessageAvatar>N</MessageAvatar>
            <MessageContent>
              <MessageText variant="bubble">
                What is the difference between a list and a tuple in Python?
              </MessageText>
            </MessageContent>
          </Message>
          <Message type="incoming">
            <MessageAvatar>AI</MessageAvatar>
            <MessageContent>
              <MessageText>
                Lists are mutable, tuples are immutable. Lists use square
                brackets, tuples use parentheses. Tuples are slightly faster and
                can be used as dictionary keys.
              </MessageText>
            </MessageContent>
          </Message>
          <Message type="outgoing">
            <MessageAvatar>N</MessageAvatar>
            <MessageContent>
              <MessageText variant="bubble">
                When would I pick one over the other?
              </MessageText>
            </MessageContent>
          </Message>
          <Message type="incoming">
            <MessageAvatar>AI</MessageAvatar>
            <MessageContent>
              <MessageText>
                Use a list when the collection will change. Reach for a tuple
                when the collection is fixed and you want the immutability
                guarantee, or when you need to use it as a key.
              </MessageText>
            </MessageContent>
          </Message>
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
