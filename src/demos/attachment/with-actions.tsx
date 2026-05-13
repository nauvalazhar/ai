import {
  DownloadIcon,
  EyeIcon,
  FileJsonIcon,
  FileTextIcon,
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
  AttachmentMedia,
} from "#/components/ai/attachment";

export default function WithActions() {
  return (
    <div className="mx-auto max-w-md flex flex-col gap-2">
      <Attachment>
        <AttachmentMedia>
          <AttachmentIcon>
            <FileTextIcon />
          </AttachmentIcon>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentName>report.pdf</AttachmentName>
          <AttachmentDescription>2.0 KB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentAction>
          <Button
            iconOnly
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Preview"
          >
            <EyeIcon />
          </Button>
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

      <Attachment>
        <AttachmentMedia>
          <AttachmentIcon>
            <FileJsonIcon />
          </AttachmentIcon>
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentName>config.json</AttachmentName>
          <AttachmentDescription>512 B</AttachmentDescription>
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
        </AttachmentAction>
      </Attachment>
    </div>
  );
}
