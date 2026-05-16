import { useState } from "react";
import { PaperclipIcon, XIcon } from "lucide-react";
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
  UploaderList,
  UploaderTrigger,
  useUploader,
  type UploaderFn,
  type UploadItem,
} from "#/components/ai/uploader";

const STORAGE_KEY = "uploader-demo:form";

const upload: UploaderFn = async ({ file, signal, onProgress }) => {
  const total = 25;
  for (let i = 1; i <= total; i++) {
    if (signal.aborted) throw new Error("aborted");
    await new Promise((r) => setTimeout(r, 70));
    onProgress((i / total) * 100);
  }
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  return { url: dataUrl };
};

function loadInitial(): UploadItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UploadItem[]) : [];
  } catch {
    return [];
  }
}

function formatSize(bytes?: number) {
  if (bytes === undefined) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function Persisted() {
  const [initial] = useState(loadInitial);

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-medium">Project attachments</h3>
        <p className="text-sm text-muted-foreground">
          Upload a few files, then reload the page. The list is restored from
          local storage.
        </p>
      </div>
      <Uploader
        uploader={upload}
        defaultItems={initial}
        onItemsChange={(next) => {
          const persistable = next
            .filter((i) => i.status === "success")
            .map(({ file: _file, ...rest }) => rest);
          if (persistable.length > 0) {
            window.localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(persistable),
            );
          } else {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }}
      >
        <FormBody />
      </Uploader>
    </div>
  );
}

function FormBody() {
  const { items, clear } = useUploader();

  return (
    <>
      <UploaderList className="flex flex-col gap-2 empty:hidden">
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
                  <PaperclipIcon />
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
                  item.status === "uploading" ? actions.cancel : actions.remove
                }
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                <XIcon />
              </Button>
            </AttachmentAction>
          </Attachment>
        )}
      </UploaderList>
      <div className="flex items-center gap-2">
        <UploaderTrigger
          render={
            <Button variant="outline">
              <PaperclipIcon />
              Attach files
            </Button>
          }
        />
        {items.length > 0 && (
          <Button variant="ghost" onClick={clear}>
            Clear all
          </Button>
        )}
      </div>
    </>
  );
}
