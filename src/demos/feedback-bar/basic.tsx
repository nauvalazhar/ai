import { Info, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  FeedbackBar,
  FeedbackBarAction,
  FeedbackBarContent,
  FeedbackBarDismiss,
  FeedbackBarIcon,
} from "#/components/ai/feedback-bar";

export default function Basic() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <FeedbackBar>
        <FeedbackBarIcon>
          <Info />
        </FeedbackBarIcon>
        <FeedbackBarContent>Was this response helpful?</FeedbackBarContent>
        <FeedbackBarAction>
          <Button iconOnly variant="ghost" aria-label="Helpful">
            <ThumbsUp />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Not helpful">
            <ThumbsDown />
          </Button>
          <FeedbackBarDismiss
            render={
              <Button iconOnly variant="ghost" aria-label="Dismiss">
                <X />
              </Button>
            }
          />
        </FeedbackBarAction>
      </FeedbackBar>
    </div>
  );
}
