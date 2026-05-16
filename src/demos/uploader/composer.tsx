import { useRef } from "react";
import { ArrowUpIcon, PaperclipIcon, XIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Composer,
  ComposerInput,
  ComposerSubmit,
  ComposerToolbar,
  ComposerToolbarSpacer,
} from "#/components/ai/composer";
import {
  Attachment,
  AttachmentIcon,
  AttachmentMedia,
  AttachmentOverlay,
  AttachmentProgress,
} from "#/components/ai/attachment";
import {
  Uploader,
  UploaderList,
  UploaderTrigger,
  useUploaderAttach,
  type UploaderFn,
} from "#/components/ai/uploader";

const upload: UploaderFn = async ({ file, signal, onProgress }) => {
  const total = 25;
  for (let i = 1; i <= total; i++) {
    if (signal.aborted) throw new Error("aborted");
    await new Promise((r) => setTimeout(r, 80));
    onProgress((i / total) * 100);
  }
  return {
    url: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
  };
};

export default function ComposerAttach() {
  return (
    <div className="mx-auto max-w-2xl">
      <Uploader uploader={upload}>
        <ComposerWithUpload />
      </Uploader>
    </div>
  );
}

function ComposerWithUpload() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const { isDragOver } = useUploaderAttach(wrapRef);

  return (
    <div
      ref={wrapRef}
      data-drag-over={isDragOver || undefined}
      className="relative"
    >
      <Composer>
        <UploaderList className="flex flex-wrap gap-2 px-1 pt-1 empty:hidden">
          {(item, actions) => (
            <Attachment
              layout="card"
              className="size-14 rounded"
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
                    <AttachmentProgress />
                  </AttachmentOverlay>
                )}
              </AttachmentMedia>
              <Button
                iconOnly
                variant="ghost"
                aria-label={
                  item.status === "uploading" ? "Cancel upload" : "Remove"
                }
                onClick={actions.remove}
                className="absolute top-1 right-1 size-4.5 rounded-full bg-foreground text-background hover:bg-foreground/85 hover:text-background [&>svg]:size-3"
              >
                <XIcon />
              </Button>
            </Attachment>
          )}
        </UploaderList>
        <ComposerInput
          placeholder="Ask anything. Drop or paste a file."
          onSubmit={() => {}}
        />
        <ComposerToolbar>
          <UploaderTrigger
            render={
              <Button iconOnly variant="ghost" aria-label="Attach files">
                <PaperclipIcon />
              </Button>
            }
          />
          <ComposerToolbarSpacer>
            <ComposerSubmit
              render={<Button iconOnly className="rounded-full" />}
            >
              <ArrowUpIcon />
            </ComposerSubmit>
          </ComposerToolbarSpacer>
        </ComposerToolbar>
      </Composer>

      {isDragOver && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-outer bg-primary/10 ring-2 ring-primary text-sm font-medium text-primary">
          Drop to attach
        </div>
      )}
    </div>
  );
}
