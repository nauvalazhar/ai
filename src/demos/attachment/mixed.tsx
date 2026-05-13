import { useEffect, useState } from "react";
import {
  AlertTriangleIcon,
  DownloadIcon,
  FileTextIcon,
  RefreshCcwIcon,
  XIcon,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Attachment,
  AttachmentAction,
  AttachmentContent,
  AttachmentDescription,
  AttachmentIcon,
  AttachmentName,
  AttachmentOverlay,
  AttachmentProgress,
  AttachmentMedia,
} from "#/components/ai/attachment";

export default function Mixed() {
  const [progress, setProgress] = useState(28);
  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 28 : p + 4));
    }, 380);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-md flex flex-col gap-2">
      <Attachment>
        <AttachmentMedia>
          <AttachmentIcon>
            <FileTextIcon />
          </AttachmentIcon>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentName>brief.pdf</AttachmentName>
          <AttachmentDescription>1.2 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentAction>
          <Button
            iconOnly
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Download"
          >
            <DownloadIcon />
          </Button>
          <Button
            iconOnly
            variant="ghost"
            aria-label="Remove attachment"
            className="size-7 text-muted-foreground hover:text-foreground"
          >
            <XIcon />
          </Button>
        </AttachmentAction>
      </Attachment>

      <Attachment progress={progress}>
        <AttachmentMedia>
          <AttachmentIcon>
            <FileTextIcon />
          </AttachmentIcon>
          <AttachmentOverlay>
            <AttachmentProgress className="size-5" />
          </AttachmentOverlay>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentName>annual-report.pdf</AttachmentName>
          <AttachmentDescription>
            Uploading… {progress}% of 4.2 MB
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentAction>
          <Button
            iconOnly
            variant="ghost"
            aria-label="Cancel upload"
            className="size-7 text-muted-foreground hover:text-foreground"
          >
            <XIcon />
          </Button>
        </AttachmentAction>
      </Attachment>

      <Attachment>
        <AttachmentMedia>
          <AttachmentIcon>
            <FileTextIcon />
          </AttachmentIcon>
          <AttachmentOverlay>
            <AttachmentProgress />
          </AttachmentOverlay>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentName>processing.csv</AttachmentName>
          <AttachmentDescription>Connecting…</AttachmentDescription>
        </AttachmentContent>
        <AttachmentAction>
          <Button
            iconOnly
            variant="ghost"
            aria-label="Cancel"
            className="size-7 text-muted-foreground hover:text-foreground"
          >
            <XIcon />
          </Button>
        </AttachmentAction>
      </Attachment>

      <Attachment state="error">
        <AttachmentMedia>
          <AttachmentIcon>
            <AlertTriangleIcon />
          </AttachmentIcon>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentName>video.mp4</AttachmentName>
          <AttachmentDescription>
            Upload failed, file too large
          </AttachmentDescription>
        </AttachmentContent>
        <AttachmentAction>
          <Button
            iconOnly
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Retry"
          >
            <RefreshCcwIcon />
          </Button>
          <Button
            iconOnly
            variant="ghost"
            aria-label="Remove attachment"
            className="size-7 text-muted-foreground hover:text-foreground"
          >
            <XIcon />
          </Button>
        </AttachmentAction>
      </Attachment>
    </div>
  );
}
