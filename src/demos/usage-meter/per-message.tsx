import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageText,
} from "#/components/ai/message";
import {
  UsageMeter,
  UsageStat,
  UsageStatLabel,
  UsageStatValue,
} from "#/components/ai/usage-meter";

export default function PerMessage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 p-6">
      <Message type="outgoing">
        <MessageContent>
          <MessageText variant="bubble">
            Summarize the differences between server components and client
            components in a sentence.
          </MessageText>
        </MessageContent>
      </Message>

      <Message type="incoming">
        <MessageAvatar>AI</MessageAvatar>
        <MessageContent>
          <MessageText>
            Server components render on the server and ship as serialized output
            with no JavaScript, while client components hydrate in the browser
            and own all interactive state.
          </MessageText>
          <UsageMeter size="sm">
            <UsageStat>
              <UsageStatLabel>In</UsageStatLabel>
              <UsageStatValue>184</UsageStatValue>
            </UsageStat>
            <UsageStat>
              <UsageStatLabel>Out</UsageStatLabel>
              <UsageStatValue>62</UsageStatValue>
            </UsageStat>
            <UsageStat>
              <UsageStatLabel>$</UsageStatLabel>
              <UsageStatValue>0.0008</UsageStatValue>
            </UsageStat>
            <UsageStat>
              <UsageStatLabel>Latency</UsageStatLabel>
              <UsageStatValue>1.2s</UsageStatValue>
            </UsageStat>
          </UsageMeter>
        </MessageContent>
      </Message>
    </div>
  );
}
