import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Message,
  MessageAction,
  MessageAvatar,
  MessageContent,
  MessageText,
} from "#/components/ai/message";

export default function WithActions() {
  return (
    <div className="mx-auto max-w-2xl">
      <Message type="incoming">
        <MessageAvatar>AI</MessageAvatar>
        <MessageContent>
          <MessageText variant="bubble" className="max-w-full">
            Action buttons under each assistant message are the standard pattern
            for copy, regenerate, and feedback. Wrap the bubble and actions in a
            column so they stack under the avatar's neighbor.
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
