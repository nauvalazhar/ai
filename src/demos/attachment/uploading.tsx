import { useEffect, useState } from "react";
import {
  CheckIcon,
  DownloadIcon,
  FileTextIcon,
  RotateCcwIcon,
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

function useRollingProgress(start = 8, step = 6, interval = 400) {
  const [progress, setProgress] = useState(start);
  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : Math.min(100, p + step)));
    }, interval);
    return () => window.clearInterval(id);
  }, [step, interval]);
  return progress;
}

function useUpload(step = 6, interval = 280) {
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);
  const done = progress >= 100;

  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => {
      setProgress((p) => Math.min(100, p + step));
    }, interval);
    return () => window.clearInterval(id);
  }, [done, step, interval, tick]);

  return {
    progress,
    done,
    restart: () => {
      setProgress(0);
      setTick((t) => t + 1);
    },
  };
}

export default function Uploading() {
  const a = useRollingProgress(12, 5, 380);
  const b = useRollingProgress(34, 7, 460);
  const row = useUpload(7, 260);
  const card = useUpload(5, 220);

  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Attachment progress={a}>
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
            <AttachmentDescription>{a}% of 4.2 MB</AttachmentDescription>
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
      </div>

      <div className="flex flex-wrap gap-3">
        <Attachment layout="card" progress={b}>
          <AttachmentMedia>
            <img
              data-slot="attachment-media-img"
              src="https://picsum.photos/seed/upload-a/128"
              alt=""
            />
            <AttachmentOverlay>
              <AttachmentProgress />
            </AttachmentOverlay>
          </AttachmentMedia>
          <Button
            iconOnly
            variant="ghost"
            aria-label="Cancel upload"
            className="absolute top-1 right-1 size-4.5 rounded-full bg-foreground text-background hover:bg-foreground/85 hover:text-background [&>svg]:size-3"
          >
            <XIcon />
          </Button>
        </Attachment>

        <Attachment layout="card">
          <AttachmentMedia>
            <img
              data-slot="attachment-media-img"
              src="https://picsum.photos/seed/upload-b/128"
              alt=""
            />
            <AttachmentOverlay>
              <AttachmentProgress />
            </AttachmentOverlay>
          </AttachmentMedia>
          <Button
            iconOnly
            variant="ghost"
            aria-label="Cancel upload"
            className="absolute top-1 right-1 size-4.5 rounded-full bg-foreground text-background hover:bg-foreground/85 hover:text-background [&>svg]:size-3"
          >
            <XIcon />
          </Button>
        </Attachment>

        <Attachment layout="card" className="ring ring-border">
          <AttachmentMedia>
            <AttachmentIcon>
              <FileTextIcon />
            </AttachmentIcon>
            <AttachmentOverlay>
              <AttachmentProgress />
            </AttachmentOverlay>
          </AttachmentMedia>
          <Button
            iconOnly
            variant="ghost"
            aria-label="Cancel upload"
            className="absolute top-1 right-1 size-4.5 rounded-full bg-foreground text-background hover:bg-foreground/85 hover:text-background [&>svg]:size-3"
          >
            <XIcon />
          </Button>
        </Attachment>
      </div>

      <div className="flex items-center gap-2">
        <Attachment progress={row.done ? undefined : row.progress}>
          <AttachmentMedia
            className={
              row.done ? "bg-success/15 text-success" : undefined
            }
          >
            <AttachmentIcon>
              {row.done ? <CheckIcon /> : <FileTextIcon />}
            </AttachmentIcon>
            {!row.done && (
              <AttachmentOverlay>
                <AttachmentProgress className="size-5" />
              </AttachmentOverlay>
            )}
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentName>annual-report.pdf</AttachmentName>
            <AttachmentDescription>
              {row.done ? "4.2 MB" : `${row.progress}% of 4.2 MB`}
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentAction>
            {row.done && (
              <Button
                iconOnly
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Download"
              >
                <DownloadIcon />
              </Button>
            )}
            <Button
              iconOnly
              variant="ghost"
              aria-label={row.done ? "Remove attachment" : "Cancel upload"}
              className="size-7 text-muted-foreground hover:text-foreground"
            >
              <XIcon />
            </Button>
          </AttachmentAction>
        </Attachment>

        <Button
          iconOnly
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={row.restart}
          aria-label="Replay"
        >
          <RotateCcwIcon />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Attachment
          layout="card"
          progress={card.done ? undefined : card.progress}
        >
          <AttachmentMedia>
            <img
              data-slot="attachment-media-img"
              src="https://picsum.photos/seed/upload-done/128"
              alt=""
            />
            {!card.done && (
              <AttachmentOverlay>
                <AttachmentProgress />
              </AttachmentOverlay>
            )}
          </AttachmentMedia>
          <Button
            iconOnly
            variant="ghost"
            aria-label={card.done ? "Remove attachment" : "Cancel upload"}
            className="absolute top-1 right-1 size-4.5 rounded-full bg-foreground text-background hover:bg-foreground/85 hover:text-background [&>svg]:size-3"
          >
            <XIcon />
          </Button>
        </Attachment>

        <Button
          iconOnly
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={card.restart}
          aria-label="Replay"
        >
          <RotateCcwIcon />
        </Button>
      </div>
    </div>
  );
}
