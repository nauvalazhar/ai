import { Message, MessageContent, MessageText } from "#/components/ai/message";

export default function Basic() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Message type="outgoing">
        <MessageContent>
          <MessageText variant="bubble">
            What's the difference between a list and a tuple in Python?
          </MessageText>
        </MessageContent>
      </Message>
      <Message type="incoming">
        <MessageContent>
          <MessageText>
            Lists are mutable and use square brackets <code>[1, 2, 3]</code>.
            Tuples are immutable and use parentheses <code>(1, 2, 3)</code>.
            Tuples are slightly faster and can be used as dictionary keys.
          </MessageText>
        </MessageContent>
      </Message>
    </div>
  );
}
