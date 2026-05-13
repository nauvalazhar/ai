import { AlertTriangleIcon, CheckIcon, XIcon } from "lucide-react";
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

export default function Danger() {
  return (
    <div className="mx-auto max-w-md p-6">
      <Confirmation defaultState="pending" tone="danger">
        <ConfirmationHeader>
          <ConfirmationIcon>
            <AlertTriangleIcon />
          </ConfirmationIcon>
          <ConfirmationTitle>
            Delete the project workspace?
          </ConfirmationTitle>
        </ConfirmationHeader>
        <ConfirmationDescription>
          This removes all files and revokes access for every collaborator. It
          cannot be undone.
        </ConfirmationDescription>

        <ConfirmationPending>
          <ConfirmationAction>
            <ConfirmationReject render={<Button variant="ghost">Keep</Button>} />
            <ConfirmationAccept
              render={
                <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90" />
              }
            >
              Delete workspace
            </ConfirmationAccept>
          </ConfirmationAction>
        </ConfirmationPending>

        <ConfirmationApproved>
          <ConfirmationStatus>
            <CheckIcon />
            Workspace deleted.
          </ConfirmationStatus>
        </ConfirmationApproved>

        <ConfirmationRejected>
          <ConfirmationStatus>
            <XIcon />
            Kept the workspace.
          </ConfirmationStatus>
        </ConfirmationRejected>
      </Confirmation>
    </div>
  );
}
