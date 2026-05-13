import {
  ArrowUpIcon,
  CopyIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react";
import { Button } from "#/components/ai/button";

export default function IconOnly() {
  return (
    <div className="mx-auto max-w-2xl flex flex-wrap items-center gap-2">
      <Button iconOnly aria-label="Send">
        <ArrowUpIcon />
      </Button>
      <Button iconOnly variant="secondary" aria-label="Regenerate">
        <RefreshCwIcon />
      </Button>
      <Button iconOnly variant="ghost" aria-label="Copy">
        <CopyIcon />
      </Button>
      <Button iconOnly variant="ghost" aria-label="Like">
        <ThumbsUpIcon />
      </Button>
      <Button iconOnly variant="ghost" aria-label="Dislike">
        <ThumbsDownIcon />
      </Button>
      <Button iconOnly variant="outline" aria-label="Send">
        <ArrowUpIcon />
      </Button>
    </div>
  );
}
