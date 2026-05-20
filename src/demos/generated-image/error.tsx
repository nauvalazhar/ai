import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  GeneratedImage,
  GeneratedImageAction,
  GeneratedImageLoading,
} from "#/components/ai/generated-image";

export default function ErrorDemo() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <GeneratedImage state="error">
        <img
          data-slot="generated-image-content"
          src="https://picsum.photos/seed/aikit-error/640"
          alt="Failed generation"
        />
        <GeneratedImageLoading />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <AlertCircleIcon className="size-7 text-destructive" />
          <div className="text-sm font-medium text-foreground">
            Generation failed
          </div>
          <div className="text-xs text-muted-foreground">
            The model could not complete the request.
          </div>
        </div>

        <GeneratedImageAction position="bottom-right">
          <Button variant="outline">
            <RefreshCwIcon />
            Retry
          </Button>
        </GeneratedImageAction>
      </GeneratedImage>
    </div>
  );
}
