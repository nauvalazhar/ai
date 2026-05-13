import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtIcon,
  ChainOfThoughtStep,
  ChainOfThoughtStepContent,
  ChainOfThoughtStepStatic,
  ChainOfThoughtStepTrigger,
} from "#/components/ai/chain-of-thought";
import { BrainIcon } from "lucide-react";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl">
      <ChainOfThought defaultOpen>
        <ChainOfThoughtHeader>
          <ChainOfThoughtIcon>
            <BrainIcon />
          </ChainOfThoughtIcon>
          Working through the request
        </ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          <ChainOfThoughtStep>
            <ChainOfThoughtStepTrigger>
              <ChainOfThoughtIcon />
              Analyzing the user's request
            </ChainOfThoughtStepTrigger>
            <ChainOfThoughtStepContent>
              <p>
                The user is asking for a side by side compare of list and tuple
                in Python. I should keep the answer focused and avoid edge cases
                unless they follow up.
              </p>
            </ChainOfThoughtStepContent>
          </ChainOfThoughtStep>

          <ChainOfThoughtStepStatic>
            <ChainOfThoughtIcon />
            Reviewing prior context
          </ChainOfThoughtStepStatic>

          <ChainOfThoughtStep defaultOpen>
            <ChainOfThoughtStepTrigger>
              <ChainOfThoughtIcon />
              Choosing the angle
            </ChainOfThoughtStepTrigger>
            <ChainOfThoughtStepContent>
              <p>
                Mutability is the headline difference. Performance comes second,
                and a quick note on syntax keeps the examples from feeling
                abrupt.
              </p>
            </ChainOfThoughtStepContent>
          </ChainOfThoughtStep>

          <ChainOfThoughtStep>
            <ChainOfThoughtStepTrigger>
              <ChainOfThoughtIcon />
              Drafting the answer
            </ChainOfThoughtStepTrigger>
            <ChainOfThoughtStepContent>
              <p>
                Open with a one line summary, show a small example for each,
                then close with a sentence on when to pick which.
              </p>
            </ChainOfThoughtStepContent>
          </ChainOfThoughtStep>

          <ChainOfThoughtStepStatic>
            <ChainOfThoughtIcon />
            Noted a follow up about performance trade offs
          </ChainOfThoughtStepStatic>

          <ChainOfThoughtStepStatic>
            <ChainOfThoughtIcon />
            Holding a longer paragraph here so we can see how the row behaves
            when the text wraps across multiple lines, since the icon column
            still needs to read as the start of the row rather than drifting
            into the middle of the block.
          </ChainOfThoughtStepStatic>
        </ChainOfThoughtContent>
      </ChainOfThought>
    </div>
  );
}
