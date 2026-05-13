import { CheckIcon, SendIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ai/button";
import {
  Confirmation,
  ConfirmationAccept,
  ConfirmationAction,
  ConfirmationApproved,
  ConfirmationDescription,
  ConfirmationHeader,
  ConfirmationIcon,
  ConfirmationPending,
  ConfirmationReject,
  ConfirmationRejected,
  ConfirmationStatus,
  ConfirmationTitle,
} from "#/components/ai/confirmation";

type State = "pending" | "approved" | "rejected";

export default function Controlled() {
  const [state, setState] = useState<State>("pending");
  const [pending, setPending] = useState(false);

  const handleAccept = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPending(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setPending(false);
    setState("approved");
  };

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setState("rejected");
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 p-6">
      <Confirmation state={state}>
        <ConfirmationHeader>
          <ConfirmationIcon>
            <SendIcon />
          </ConfirmationIcon>
          <ConfirmationTitle>Send the weekly digest?</ConfirmationTitle>
        </ConfirmationHeader>
        <ConfirmationDescription>
          Goes to 142 subscribers. The send is final once approved.
        </ConfirmationDescription>

        <ConfirmationPending>
          <ConfirmationAction>
            <ConfirmationReject
              render={<Button variant="ghost">Hold</Button>}
              onClick={handleReject}
              disabled={pending}
            />
            <ConfirmationAccept
              render={<Button loading={pending}>Send digest</Button>}
              onClick={handleAccept}
            />
          </ConfirmationAction>
        </ConfirmationPending>

        <ConfirmationApproved>
          <ConfirmationStatus>
            <CheckIcon />
            Digest sent to 142 subscribers.
          </ConfirmationStatus>
        </ConfirmationApproved>

        <ConfirmationRejected>
          <ConfirmationStatus>
            <XIcon />
            Held for now.
          </ConfirmationStatus>
        </ConfirmationRejected>
      </Confirmation>

      <button
        type="button"
        onClick={() => setState("pending")}
        className="self-center text-xs text-muted-foreground hover:text-foreground"
      >
        Reset
      </button>
    </div>
  );
}
