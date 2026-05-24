import { CheckIcon, DatabaseIcon, XIcon } from "lucide-react";
import ShikiHighlighter from "#/lib/shiki";
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

const query = `-- backfill missing plan field
UPDATE accounts
SET plan = 'free'
WHERE plan IS NULL
  AND created_at >= '2026-01-01';`;

export default function SqlQuery() {
  return (
    <div className="mx-auto max-w-lg p-6">
      <Confirmation defaultState="pending" tone="danger">
        <ConfirmationHeader>
          <ConfirmationIcon>
            <DatabaseIcon />
          </ConfirmationIcon>
          <ConfirmationTitle>Run this query on production?</ConfirmationTitle>
        </ConfirmationHeader>
        <ConfirmationDescription>
          The model wants to update 1,284 rows. Review the statement before it
          runs against the analytics database.
        </ConfirmationDescription>

        <ConfirmationContent>
          <ShikiHighlighter
            language="sql"
            theme={{ light: "github-light", dark: "github-dark" }}
            defaultColor="light"
            addDefaultStyles={false}
            showLanguage={false}
            className="overflow-x-auto rounded ring ring-border bg-surface-elevated text-xs/5 font-mono [&_pre]:bg-transparent! [&_pre]:outline-none! [&_pre]:px-3 [&_pre]:py-2.5"
          >
            {query}
          </ShikiHighlighter>
        </ConfirmationContent>

        <ConfirmationPending>
          <ConfirmationAction>
            <ConfirmationReject
              render={<Button variant="ghost">Don&apos;t run</Button>}
            />
            <ConfirmationAccept
              render={
                <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90" />
              }
            >
              Run query
            </ConfirmationAccept>
          </ConfirmationAction>
        </ConfirmationPending>

        <ConfirmationApproved>
          <ConfirmationStatus>
            <CheckIcon />
            Query executed. 1,284 rows updated.
          </ConfirmationStatus>
        </ConfirmationApproved>

        <ConfirmationRejected>
          <ConfirmationStatus>
            <XIcon />
            Skipped.
          </ConfirmationStatus>
        </ConfirmationRejected>
      </Confirmation>
    </div>
  );
}
