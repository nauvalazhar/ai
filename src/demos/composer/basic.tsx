import { useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Composer,
  ComposerInput,
  ComposerSubmit,
  ComposerToolbar,
  ComposerToolbarSpacer,
} from "#/components/ai/composer";

export default function Basic() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <p className="text-sm text-muted-foreground">
        Enter inserts a newline. Use the send button to submit. Best for long-form input where
        the keyboard should not commit on every Enter.
      </p>
      <Composer>
        <ComposerInput
          placeholder="Write a note. Enter for newline, click send to submit."
          submitOnEnter={false}
          onSubmit={(text) => setLast(text)}
        />
        <ComposerToolbar>
          <ComposerToolbarSpacer>
            <ComposerSubmit render={<Button iconOnly className="rounded-full" />}>
              <ArrowUpIcon />
            </ComposerSubmit>
          </ComposerToolbarSpacer>
        </ComposerToolbar>
      </Composer>

      {last ? (
        <div className="rounded-outer border border-border bg-surface p-3 text-xs">
          <div className="mb-1.5 text-muted-foreground">Last submitted</div>
          <pre className="whitespace-pre-wrap text-foreground">{last}</pre>
        </div>
      ) : null}
    </div>
  );
}
