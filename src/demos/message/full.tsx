import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Message,
  MessageAction,
  MessageAvatar,
  MessageContent,
  MessageText,
} from "#/components/ai/message";

export default function Full() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Message type="outgoing">
        <MessageAvatar>N</MessageAvatar>
        <MessageContent>
          <MessageText variant="bubble">
            Can you give me a quick rundown of the new TypeScript 6 changes?
          </MessageText>
        </MessageContent>
      </Message>
      <Message type="incoming">
        <MessageAvatar>AI</MessageAvatar>
        <MessageContent>
          <MessageText>Sure, three things stand out:</MessageText>
          <MessageText>
            <strong>1. Stricter inference.</strong> Generic narrowing now
            propagates through conditional types more aggressively, so a lot of{" "}
            <code>as</code> casts can come out.
          </MessageText>
          <MessageText>
            <strong>2. Faster project references.</strong> Incremental builds no
            longer re-walk unchanged graphs, so large monorepos see 30 to 50%
            wins out of the box.
          </MessageText>
          <MessageText>
            <strong>3. Native decorators.</strong> The TC39 stage-3 decorator
            shape is now the default, and the legacy flag is deprecated.
          </MessageText>
          <MessageAction>
            <Button
              iconOnly
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Copy"
            >
              <Copy />
            </Button>
            <Button
              iconOnly
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Regenerate"
            >
              <RefreshCw />
            </Button>
            <Button
              iconOnly
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Thumbs up"
            >
              <ThumbsUp />
            </Button>
            <Button
              iconOnly
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Thumbs down"
            >
              <ThumbsDown />
            </Button>
          </MessageAction>
        </MessageContent>
      </Message>
    </div>
  );
}
