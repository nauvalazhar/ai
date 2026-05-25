import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "#/components/ai/popover";
import { Status } from "#/components/ai/status";

type Connection = "disconnected" | "connecting" | "connected" | "error";

const TONE = {
  disconnected: "neutral",
  connecting: "inflight",
  connected: "active",
  error: "error",
} as const;

const LABEL = {
  disconnected: "Offline",
  connecting: "Connecting",
  connected: "Live",
  error: "Connection failed",
} as const;

function ConnectionStatus({ value }: { value: Connection }) {
  return (
    <Status state={TONE[value]} pulse={value === "connecting"}>
      {LABEL[value]}
    </Status>
  );
}

export default function Connection() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 p-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <ConnectionStatus value="connected" />
        <ConnectionStatus value="connecting" />
        <ConnectionStatus value="disconnected" />
        <ConnectionStatus value="error" />
      </div>

      <Popover>
        <PopoverTrigger
          render={
            <Status
              state="error"
              render={(props) => <button type="button" {...props} />}
            >
              Connection failed
            </Status>
          }
        />
        <PopoverPopup className="w-80" side="bottom" align="end">
          <PopoverTitle>Connection failed</PopoverTitle>
          <PopoverDescription>
            The server closed the stream with <code>ECONNRESET</code> after 4
            retries. Last attempt was 12 seconds ago. Your draft is saved
            locally and will resend once the connection recovers.
          </PopoverDescription>
        </PopoverPopup>
      </Popover>
    </div>
  );
}
