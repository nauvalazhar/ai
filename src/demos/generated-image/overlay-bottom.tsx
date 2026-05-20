import { DownloadIcon, Share2Icon, SparklesIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  GeneratedImage,
  GeneratedImageAction,
  GeneratedImageLoading,
  GeneratedImageOverlay,
} from "#/components/ai/generated-image";

export default function OverlayBottom() {
  return (
    <div className="mx-auto w-full max-w-md">
      <GeneratedImage state="ready" aspectRatio="video">
        <img
          data-slot="generated-image-content"
          src="https://picsum.photos/seed/aikit-wide/960"
          alt="A wide generated landscape"
        />
        <GeneratedImageLoading />
        <GeneratedImageOverlay position="bottom" />
        <GeneratedImageAction position="bottom-right">
          <Button iconOnly variant="ghost" aria-label="Variation">
            <SparklesIcon />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Share">
            <Share2Icon />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Download">
            <DownloadIcon />
          </Button>
        </GeneratedImageAction>
      </GeneratedImage>
    </div>
  );
}
