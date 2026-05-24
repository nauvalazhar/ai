import { useEffect, useRef, useState } from "react";
import { DownloadIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  GeneratedImage,
  GeneratedImageAction,
  GeneratedImageError,
  GeneratedImageHeader,
  GeneratedImageLoading,
  GeneratedImageOverlay,
  GeneratedImagePlaceholder,
  GeneratedImageProgress,
  GeneratedImageTitle,
} from "#/components/ai/generated-image";

type State = "queued" | "generating" | "complete" | "error";

const STEPS: Array<{ state: State; ms: number; advanceSeed: boolean }> = [
  { state: "queued", ms: 1200, advanceSeed: false },
  { state: "generating", ms: 2600, advanceSeed: false },
  { state: "complete", ms: 2200, advanceSeed: false },
  { state: "queued", ms: 1200, advanceSeed: true },
  { state: "generating", ms: 2600, advanceSeed: false },
  { state: "error", ms: 2200, advanceSeed: false },
];

export default function Streaming() {
  const [stepIndex, setStepIndex] = useState(0);
  const [seed, setSeed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = STEPS[stepIndex];

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const next = (stepIndex + 1) % STEPS.length;
      if (STEPS[next].advanceSeed) setSeed((s) => s + 1);
      setStepIndex(next);
    }, step.ms);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stepIndex, step.ms]);

  function regenerate() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSeed((s) => s + 1);
    setStepIndex(0);
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
      <GeneratedImage state={step.state}>
        <img
          data-slot="generated-image-content"
          src={`https://picsum.photos/seed/aikit-stream-${seed}/640`}
          alt="A generated scene"
        />
        <GeneratedImageLoading />
        <GeneratedImageHeader>
          <GeneratedImagePlaceholder>
            <GeneratedImageTitle>Queued</GeneratedImageTitle>
            <div className="text-xs text-muted-foreground">
              Waiting for a slot
            </div>
          </GeneratedImagePlaceholder>
          <GeneratedImageProgress>
            <GeneratedImageTitle>Generating</GeneratedImageTitle>
            <div className="text-xs text-white/70">
              A still mountain lake at dusk
            </div>
          </GeneratedImageProgress>
          <GeneratedImageError>
            <GeneratedImageTitle>Generation failed</GeneratedImageTitle>
            <div className="text-xs text-muted-foreground">
              The model could not complete the request.
            </div>
          </GeneratedImageError>
        </GeneratedImageHeader>
        <GeneratedImageOverlay />
        <GeneratedImageAction>
          <Button iconOnly variant="ghost" aria-label="Download">
            <DownloadIcon />
          </Button>
        </GeneratedImageAction>
      </GeneratedImage>

      <Button
        variant="outline"
        onClick={regenerate}
        loading={step.state !== "complete" && step.state !== "error"}
        className="self-center"
      >
        <RefreshCwIcon />
        {step.state === "error" ? "Retry" : "Regenerate"}
      </Button>
    </div>
  );
}
