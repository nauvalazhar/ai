import {
  ArrowRightIcon,
  ArrowUpIcon,
  CopyIcon,
  RefreshCwIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "#/components/ai/button";

export default function WithIcon() {
  return (
    <div className="mx-auto max-w-2xl flex flex-wrap items-center gap-2">
      <Button>
        <ArrowUpIcon />
        Send
      </Button>
      <Button variant="secondary">
        <RefreshCwIcon />
        Regenerate
      </Button>
      <Button variant="ghost">
        <CopyIcon />
        Copy
      </Button>
      <Button variant="outline">
        <SparklesIcon />
        Improve
      </Button>
      <Button variant="secondary">
        Continue
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
