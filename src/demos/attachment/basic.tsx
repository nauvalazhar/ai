import {
  FileIcon,
  FileJsonIcon,
  FileTextIcon,
  ImageIcon,
  MusicIcon,
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

const FILES = [
  { name: "report.pdf", size: "2.0 KB", icon: <FileTextIcon /> },
  { name: "config.json", size: "512 B", icon: <FileJsonIcon /> },
  { name: "notes.txt", size: "128 B", icon: <FileIcon /> },
  { name: "photo.png", size: "1.4 MB", icon: <ImageIcon /> },
  { name: "track.mp3", size: "3.8 MB", icon: <MusicIcon /> },
];

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl flex flex-wrap gap-4">
      {FILES.map((file) => (
        <Attachment key={file.name}>
          <AttachmentMedia>
            <AttachmentIcon>{file.icon}</AttachmentIcon>
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentName>{file.name}</AttachmentName>
            <AttachmentDescription>{file.size}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentAction>
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
      ))}
    </div>
  );
}
