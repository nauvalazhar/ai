import { CheckIcon, FileTextIcon, XIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Confirmation,
  ConfirmationAccept,
  ConfirmationAction,
  ConfirmationApproved,
  ConfirmationContent,
  ConfirmationDescription,
  ConfirmationHeader,
  ConfirmationIcon,
  ConfirmationPending,
  ConfirmationReject,
  ConfirmationRejected,
  ConfirmationStatus,
  ConfirmationTitle,
} from "#/components/ai/confirmation";

export default function WithContent() {
  return (
    <div className="mx-auto max-w-lg p-6">
      <Confirmation defaultState="pending">
        <ConfirmationHeader>
          <ConfirmationIcon>
            <FileTextIcon />
          </ConfirmationIcon>
          <ConfirmationTitle>Create the invoice draft?</ConfirmationTitle>
        </ConfirmationHeader>
        <ConfirmationDescription>
          Review the details before the draft is saved to your invoices folder.
        </ConfirmationDescription>

        <ConfirmationContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded bg-surface-elevated px-3 py-2.5 text-sm">
            <dt className="text-muted-foreground">Client</dt>
            <dd className="text-foreground">Helio Studios</dd>
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="text-foreground">$4,250.00</dd>
            <dt className="text-muted-foreground">Due</dt>
            <dd className="text-foreground">May 27, 2026</dd>
          </dl>
        </ConfirmationContent>

        <ConfirmationPending>
          <ConfirmationAction>
            <ConfirmationReject
              render={<Button variant="ghost">Discard</Button>}
            />
            <ConfirmationAccept render={<Button>Save draft</Button>} />
          </ConfirmationAction>
        </ConfirmationPending>

        <ConfirmationApproved>
          <ConfirmationStatus>
            <CheckIcon />
            Draft saved.
          </ConfirmationStatus>
        </ConfirmationApproved>

        <ConfirmationRejected>
          <ConfirmationStatus>
            <XIcon />
            Discarded.
          </ConfirmationStatus>
        </ConfirmationRejected>
      </Confirmation>
    </div>
  );
}
