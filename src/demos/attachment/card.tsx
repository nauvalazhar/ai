import { FileTextIcon, XIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Attachment,
  AttachmentIcon,
  AttachmentMedia,
} from "#/components/ai/attachment";

export default function Card() {
  return (
    <div className="mx-auto max-w-md flex flex-wrap items-start gap-4">
      <Attachment layout="card">
        <AttachmentMedia>
          <img
            data-slot="attachment-media-img"
            src="https://picsum.photos/seed/aikit-1/128"
            alt=""
          />
        </AttachmentMedia>
        <Button
          iconOnly
          variant="ghost"
          aria-label="Remove attachment"
          className="absolute top-1 right-1 size-4.5 rounded-full bg-foreground text-background hover:bg-foreground/85 hover:text-background [&>svg]:size-3"
        >
          <XIcon />
        </Button>
      </Attachment>

      <Attachment layout="card">
        <AttachmentMedia>
          <img
            data-slot="attachment-media-img"
            src="https://picsum.photos/seed/aikit-2/128"
            alt=""
          />
        </AttachmentMedia>
        <Button
          iconOnly
          variant="ghost"
          aria-label="Remove attachment"
          className="absolute top-1 right-1 size-4.5 rounded-full bg-foreground text-background hover:bg-foreground/85 hover:text-background [&>svg]:size-3"
        >
          <XIcon />
        </Button>
      </Attachment>

      <Attachment layout="card">
        <AttachmentMedia className="bg-blue-600" />
        <Button
          iconOnly
          variant="ghost"
          aria-label="Remove attachment"
          className="absolute top-1 right-1 size-4.5 rounded-full bg-foreground text-background hover:bg-foreground/85 hover:text-background [&>svg]:size-3"
        >
          <XIcon />
        </Button>
      </Attachment>

      <Attachment layout="card">
        <AttachmentMedia>
          <AttachmentIcon>
            <FileTextIcon />
          </AttachmentIcon>
        </AttachmentMedia>
        <Button
          iconOnly
          variant="ghost"
          aria-label="Remove attachment"
          className="absolute top-1 right-1 size-4.5 rounded-full bg-foreground text-background hover:bg-foreground/85 hover:text-background [&>svg]:size-3"
        >
          <XIcon />
        </Button>
      </Attachment>
    </div>
  );
}
