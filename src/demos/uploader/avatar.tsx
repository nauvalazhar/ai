import { CameraIcon, UserIcon } from "lucide-react";
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
} from "#/components/ai/uploader";

const upload: UploaderFn = async ({ file, signal, onProgress }) => {
  const total = 30;
  for (let i = 1; i <= total; i++) {
    if (signal.aborted) throw new Error("aborted");
    await new Promise((r) => setTimeout(r, 70));
    onProgress((i / total) * 100);
  }
  return { url: URL.createObjectURL(file) };
};

export default function Avatar() {
  return (
    <div className="mx-auto max-w-md flex flex-col items-center gap-4 py-8">
      <Uploader uploader={upload} maxFiles={1} accept="image/*" multiple={false}>
        <AvatarTile />
        <p className="text-sm text-muted-foreground">Click the avatar to upload</p>
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
      className="size-24 rounded-full overflow-hidden ring-2 ring-border [&_[data-slot=attachment-media-img]]:rounded-full"
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
            <CameraIcon className="size-8" />
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
