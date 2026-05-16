import { useState } from "react";
import { CameraIcon, UserIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Attachment,
  AttachmentMedia,
  AttachmentOverlay,
  AttachmentProgress,
} from "#/components/ai/attachment";
import {
  Uploader,
  useUploader,
  type UploaderFn,
  type UploadItem,
} from "#/components/ai/uploader";

const STORAGE_KEY = "uploader-demo:avatar";

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
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UploadItem;
    return [parsed];
  } catch {
    return [];
  }
}

export default function Persisted() {
  const [initial] = useState(loadInitial);

  return (
    <div className="mx-auto max-w-md flex flex-col items-center gap-4 py-8">
      <Uploader
        uploader={upload}
        maxFiles={1}
        multiple={false}
        accept="image/*"
        defaultItems={initial}
        onItemsChange={(next) => {
          const done = next.find((i) => i.status === "success");
          if (done) {
            const { file: _file, ...rest } = done;
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
          } else if (next.length === 0) {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }}
      >
        <AvatarTile />
        <p className="text-sm text-muted-foreground text-center">
          Upload an image, then reload the page. The avatar persists.
        </p>
        <ClearButton />
      </Uploader>
    </div>
  );
}

function AvatarTile() {
  const { items, open } = useUploader();
  const item = items[0];
  const uploading = item?.status === "uploading";

  return (
    <Attachment
      layout="card"
      progress={uploading ? item.progress : undefined}
      state={item?.status === "error" ? "error" : "default"}
      className="size-28 rounded-full overflow-hidden ring-2 ring-border [&_[data-slot=attachment-media-img]]:rounded-full"
      render={
        <button
          type="button"
          onClick={open}
          aria-label={item ? "Change photo" : "Upload photo"}
        />
      }
    >
      <AttachmentMedia className="rounded-full">
        {item?.preview ? (
          <img data-slot="attachment-media-img" src={item.preview} alt="" />
        ) : item ? (
          <UserIcon className="size-10" />
        ) : (
          <div className="flex size-full items-center justify-center bg-surface-elevated text-muted-foreground">
            <CameraIcon className="size-9" />
          </div>
        )}
        {uploading && (
          <AttachmentOverlay className="rounded-full">
            <AttachmentProgress />
          </AttachmentOverlay>
        )}
      </AttachmentMedia>
    </Attachment>
  );
}

function ClearButton() {
  const { items, clear } = useUploader();
  if (items.length === 0) return null;
  return (
    <Button variant="ghost" onClick={clear}>
      Remove photo
    </Button>
  );
}
