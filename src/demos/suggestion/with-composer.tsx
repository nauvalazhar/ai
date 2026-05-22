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
import { Suggestion } from "#/components/ai/suggestion";

const prompts = [
  "Write a poem about the ocean",
  "Summarize this article",
  "Plan a weekend trip to Kyoto",
];

export default function WithComposer() {
  const [text, setText] = useState("");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <div className="flex flex-wrap items-center gap-2">
        {prompts.map((prompt) => (
          <Suggestion key={prompt} onClick={() => setText(prompt)}>
            {prompt}
          </Suggestion>
        ))}
      </div>

      <Composer>
        <ComposerInput
          placeholder="Pick a suggestion or write your own."
          value={text}
          onValueChange={setText}
          onSubmit={() => setText("")}
        />
        <ComposerToolbar>
          <ComposerToolbarSpacer>
            <ComposerSubmit
              render={<Button iconOnly className="rounded-full" />}
            >
              <ArrowUpIcon />
            </ComposerSubmit>
          </ComposerToolbarSpacer>
        </ComposerToolbar>
      </Composer>
    </div>
  );
}
