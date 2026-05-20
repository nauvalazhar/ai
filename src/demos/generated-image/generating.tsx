import { useEffect, useRef, useState } from "react";
import { DownloadIcon, PencilIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  GeneratedImage,
  GeneratedImageAction,
  GeneratedImageLoading,
  GeneratedImageOverlay,
  GeneratedImageTitle,
} from "#/components/ai/generated-image";

export default function Generating() {
  const [state, setState] = useState<"generating" | "ready">("ready");
  const [seed, setSeed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function regenerate() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSeed((s) => s + 1);
    setState("generating");
    timerRef.current = setTimeout(() => setState("ready"), 2500);
  }

  const generating = state === "generating";

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <GeneratedImage state={state}>
        <GeneratedImageTitle>
          {generating ? "Creating image" : "Generated Image"}
        </GeneratedImageTitle>
        <img
          data-slot="generated-image-content"
          src={`https://picsum.photos/seed/aikit-gen-${seed}/640`}
          alt="A generated scene"
        />
        <GeneratedImageLoading />
        <GeneratedImageOverlay />
        <GeneratedImageAction>
          <Button iconOnly variant="ghost" aria-label="Edit">
            <PencilIcon />
          </Button>
          <Button
            iconOnly
            variant="ghost"
            onClick={regenerate}
            aria-label="Regenerate"
          >
            <RefreshCwIcon />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Download">
            <DownloadIcon />
          </Button>
        </GeneratedImageAction>
      </GeneratedImage>

      <Button
        variant="outline"
        onClick={regenerate}
        loading={generating}
        className="self-center"
      >
        <RefreshCwIcon />
        {generating ? "Generating" : "Regenerate"}
      </Button>
    </div>
  );
}
