import { DownloadIcon, PencilIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  GeneratedImage,
  GeneratedImageAction,
  GeneratedImageLoading,
  GeneratedImageOverlay,
} from "#/components/ai/generated-image";

export default function Basic() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <GeneratedImage state="complete">
        <img
          data-slot="generated-image-content"
          src="https://picsum.photos/seed/aikit-gen/640"
          alt="A generated landscape"
        />
        <GeneratedImageLoading />
        <GeneratedImageOverlay />
        <GeneratedImageAction>
          <Button iconOnly variant="ghost" aria-label="Edit">
            <PencilIcon />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Regenerate">
            <RefreshCwIcon />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Download">
            <DownloadIcon />
          </Button>
        </GeneratedImageAction>
      </GeneratedImage>
    </div>
  );
}
