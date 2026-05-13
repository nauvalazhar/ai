import { FileIcon, FileJsonIcon, FileTextIcon } from "lucide-react";
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentIcon,
  AttachmentMedia,
  AttachmentName,
} from "#/components/ai/attachment";

const FILES = [
  {
    name: "report.pdf",
    size: "2.0 KB",
    icon: <FileTextIcon />,
    href: "#",
  },
  {
    name: "config.json",
    size: "512 B",
    icon: <FileJsonIcon />,
    href: "#",
  },
  {
    name: "notes.txt",
    size: "128 B",
    icon: <FileIcon />,
    href: "#",
  },
];

export default function Interactive() {
  return (
    <div className="mx-auto max-w-md flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {FILES.map((file) => (
          <Attachment
            key={file.name}
            render={<a href={file.href} target="_blank" rel="noreferrer" />}
          >
            <AttachmentMedia>
              <AttachmentIcon>{file.icon}</AttachmentIcon>
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentName>{file.name}</AttachmentName>
              <AttachmentDescription>{file.size}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Attachment
          layout="card"
          render={<button type="button" onClick={() => {}} />}
        >
          <AttachmentMedia>
            <img
              data-slot="attachment-media-img"
              src="https://picsum.photos/seed/interactive-1/128"
              alt=""
            />
          </AttachmentMedia>
        </Attachment>
        <Attachment
          layout="card"
          render={<button type="button" onClick={() => {}} />}
        >
          <AttachmentMedia>
            <img
              data-slot="attachment-media-img"
              src="https://picsum.photos/seed/interactive-2/128"
              alt=""
            />
          </AttachmentMedia>
        </Attachment>
        <Attachment
          layout="card"
          render={<button type="button" onClick={() => {}} />}
        >
          <AttachmentMedia>
            <AttachmentIcon>
              <FileTextIcon />
            </AttachmentIcon>
          </AttachmentMedia>
        </Attachment>
      </div>
    </div>
  );
}
