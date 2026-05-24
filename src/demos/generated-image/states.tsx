import { RefreshCwIcon } from "lucide-react";
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

export default function States() {
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-4">
      <GeneratedImage state="queued">
        <GeneratedImageHeader>
          <GeneratedImagePlaceholder>
            <GeneratedImageTitle>Queued</GeneratedImageTitle>
            <div className="text-xs text-muted-foreground">
              Waiting for a slot
            </div>
          </GeneratedImagePlaceholder>
        </GeneratedImageHeader>
      </GeneratedImage>

      <GeneratedImage state="generating">
        <GeneratedImageLoading />
        <GeneratedImageHeader>
          <GeneratedImageProgress>
            <GeneratedImageTitle>Generating</GeneratedImageTitle>
            <div className="text-xs text-white/70">
              A still mountain lake at dusk
            </div>
          </GeneratedImageProgress>
        </GeneratedImageHeader>
      </GeneratedImage>

      <GeneratedImage state="complete">
        <img
          data-slot="generated-image-content"
          src="https://picsum.photos/seed/aikit-states-complete/640"
          alt="A generated landscape"
        />
        <GeneratedImageOverlay />
      </GeneratedImage>

      <GeneratedImage state="error">
        <img
          data-slot="generated-image-content"
          src="https://picsum.photos/seed/aikit-states-error/640"
          alt="Failed generation"
        />
        <GeneratedImageHeader>
          <GeneratedImageError>
            <GeneratedImageTitle>Generation failed</GeneratedImageTitle>
            <div className="text-xs text-muted-foreground">
              The model could not complete the request.
            </div>
          </GeneratedImageError>
        </GeneratedImageHeader>
        <GeneratedImageAction position="bottom-right">
          <Button variant="ghost">
            <RefreshCwIcon />
            Retry
          </Button>
        </GeneratedImageAction>
      </GeneratedImage>
    </div>
  );
}
