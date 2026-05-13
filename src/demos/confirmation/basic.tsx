import { CheckIcon, ShieldCheckIcon, XIcon } from "lucide-react";
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

export default function Basic() {
  return (
    <div className="mx-auto max-w-md p-6">
      <Confirmation defaultState="pending">
        <ConfirmationHeader>
          <ConfirmationIcon>
            <ShieldCheckIcon />
          </ConfirmationIcon>
          <ConfirmationTitle>Send the draft to Alex?</ConfirmationTitle>
        </ConfirmationHeader>
        <ConfirmationDescription>
          The reply will be sent from your work address.
        </ConfirmationDescription>

        <ConfirmationPending>
          <ConfirmationAction>
            <ConfirmationReject
              render={<Button variant="ghost">Cancel</Button>}
            />
            <ConfirmationAccept render={<Button>Send</Button>} />
          </ConfirmationAction>
        </ConfirmationPending>

        <ConfirmationApproved>
          <ConfirmationStatus>
            <CheckIcon />
            Sent to Alex.
          </ConfirmationStatus>
        </ConfirmationApproved>

        <ConfirmationRejected>
          <ConfirmationStatus>
            <XIcon />
            Cancelled.
          </ConfirmationStatus>
        </ConfirmationRejected>
      </Confirmation>
    </div>
  );
}
