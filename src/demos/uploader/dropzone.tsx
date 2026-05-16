import { UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Attachment,
  AttachmentAction,
  AttachmentContent,
  AttachmentDescription,
  AttachmentIcon,
  AttachmentMedia,
  AttachmentName,
  AttachmentOverlay,
  AttachmentProgress,
} from "#/components/ai/attachment";
import {
  Uploader,
  UploaderDropzone,
  UploaderList,
  UploaderTrigger,
  type UploaderFn,
} from "#/components/ai/uploader";

const upload: UploaderFn = async ({ file, signal, onProgress }) => {
  const total = 40;
  for (let i = 1; i <= total; i++) {
    if (signal.aborted) throw new Error("aborted");
    await new Promise((r) => setTimeout(r, 90));
    onProgress((i / total) * 100);
  }
  return {
    url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
  };
};

function formatSize(bytes?: number) {
  if (bytes === undefined) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function Dropzone() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-4">
      <Uploader uploader={upload} multiple>
        <UploaderDropzone className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border bg-surface px-6 py-10 text-center text-muted-foreground rounded-outer data-drag-over:bg-accent">
          <UploadCloudIcon className="size-8" />
          <div className="text-sm">
            <p className="text-foreground">Drop files here</p>
            <p className="text-xs">or pick from your device</p>
          </div>
          <UploaderTrigger
            render={<Button variant="outline">Browse files</Button>}
          />
        </UploaderDropzone>

        <UploaderList className="flex flex-col gap-2">
          {(item, actions) => (
            <Attachment
              progress={item.status === "uploading" ? item.progress : undefined}
              state={item.status === "error" ? "error" : "default"}
            >
              <AttachmentMedia>
                {item.preview ? (
                  <img
                    data-slot="attachment-media-img"
                    src={item.preview}
                    alt=""
                  />
                ) : (
                  <AttachmentIcon>
                    <UploadCloudIcon />
                  </AttachmentIcon>
                )}
                {item.status === "uploading" && (
                  <AttachmentOverlay>
                    <AttachmentProgress className="size-5" />
                  </AttachmentOverlay>
                )}
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentName>{item.name}</AttachmentName>
                <AttachmentDescription>
                  {item.status === "uploading"
                    ? `${Math.round(item.progress)}% of ${formatSize(item.size)}`
                    : item.status === "error"
                      ? (item.error?.message ?? "Upload failed")
                      : item.status === "canceled"
                        ? "Canceled"
                        : formatSize(item.size)}
                </AttachmentDescription>
              </AttachmentContent>
              <AttachmentAction>
                <Button
                  iconOnly
                  variant="ghost"
                  aria-label={
                    item.status === "uploading" ? "Cancel upload" : "Remove"
                  }
                  onClick={
                    item.status === "uploading"
                      ? actions.cancel
                      : actions.remove
                  }
                  className="size-7 text-muted-foreground hover:text-foreground"
                >
                  <XIcon />
                </Button>
              </AttachmentAction>
            </Attachment>
          )}
        </UploaderList>
      </Uploader>
    </div>
  );
}
