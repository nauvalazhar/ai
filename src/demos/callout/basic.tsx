import { AlertTriangle, Info, OctagonAlert } from "lucide-react";
import {
  Callout,
  CalloutContent,
  CalloutIcon,
} from "#/components/ai/callout";

export default function Basic() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-3 p-6">
      <Callout>
        <CalloutIcon>
          <Info />
        </CalloutIcon>
        <CalloutContent>
          The assistant has access to your repo as a read-only tool. It can
          search and open files but will ask before writing or running
          commands.
        </CalloutContent>
      </Callout>

      <Callout tone="warning">
        <CalloutIcon>
          <AlertTriangle />
        </CalloutIcon>
        <CalloutContent>
          This conversation is close to the context limit. Older turns may be
          summarized to make room for the next response.
        </CalloutContent>
      </Callout>

      <Callout tone="danger">
        <CalloutIcon>
          <OctagonAlert />
        </CalloutIcon>
        <CalloutContent>
          Clearing the chat removes the full history and resets the
          assistant's memory of this session. This cannot be undone.
        </CalloutContent>
      </Callout>
    </div>
  );
}
