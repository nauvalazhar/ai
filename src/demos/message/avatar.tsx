import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageText,
} from "#/components/ai/message";

export default function WithAvatar() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Message type="outgoing">
        <MessageAvatar>N</MessageAvatar>
        <MessageContent>
          <MessageText variant="bubble">
            Can you summarize this article in one sentence?
          </MessageText>
        </MessageContent>
      </Message>
      <Message type="incoming">
        <MessageAvatar>AI</MessageAvatar>
        <MessageContent>
          <MessageText>
            Of course, share the article and I'll condense it for you.
          </MessageText>
        </MessageContent>
      </Message>
    </div>
  );
}
