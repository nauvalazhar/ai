import { useState } from "react";
import { CornerDownLeftIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Prompt,
  PromptFooter,
  PromptHint,
  PromptOption,
  PromptOptionOther,
  PromptQuestion,
  PromptStep,
  PromptSubmit,
} from "#/components/ai/prompt";

export default function WithOther() {
  const [log, setLog] = useState<{ value: string; isOther: boolean } | null>(
    null,
  );

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
      <Prompt
        onAnswer={(value, ctx) => setLog({ value, isOther: ctx.isOther })}
      >
        <PromptStep name="action" defaultValue="run">
          <PromptQuestion>
            Should I run the migration on production?
          </PromptQuestion>
          <PromptOption value="run">Yes, run it</PromptOption>
          <PromptOption value="dry">Dry run only</PromptOption>
          <PromptOption value="skip">Skip for now</PromptOption>
          <PromptOptionOther placeholder="No, and tell me what to do instead" />
        </PromptStep>
        <PromptFooter>
          <PromptHint keys="ESC">Dismiss</PromptHint>
          <PromptSubmit render={<Button />}>
            Submit
            <CornerDownLeftIcon />
          </PromptSubmit>
        </PromptFooter>
      </Prompt>

      <div className="text-xs text-muted-foreground">
        {log ? (
          <>
            <span className="text-foreground">{log.value}</span>
            <span className="ml-2">
              ({log.isOther ? "free text" : "predefined"})
            </span>
          </>
        ) : (
          "—"
        )}
      </div>
    </div>
  );
}
