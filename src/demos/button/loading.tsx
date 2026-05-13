import { useState } from "react";
import { ArrowRightIcon, ArrowUpIcon, SparklesIcon } from "lucide-react";
import { Button } from "#/components/ai/button";

export default function Loading() {
  const [busy, setBusy] = useState<string | null>(null);

  function run(id: string) {
    setBusy(id);
    setTimeout(() => setBusy(null), 3000);
  }

  return (
    <div className="mx-auto max-w-2xl flex flex-wrap items-center gap-2">
      <Button loading={busy === "none"} onClick={() => run("none")}>
        Send
      </Button>
      <Button
        variant="secondary"
        loading={busy === "left"}
        onClick={() => run("left")}
      >
        <SparklesIcon />
        Improve
      </Button>
      <Button
        variant="outline"
        loading={busy === "right"}
        onClick={() => run("right")}
      >
        Continue
        <ArrowRightIcon />
      </Button>
      <Button
        iconOnly
        aria-label="Send"
        loading={busy === "icon"}
        onClick={() => run("icon")}
      >
        <ArrowUpIcon />
      </Button>
    </div>
  );
}
