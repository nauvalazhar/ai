import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "#/components/ai/reasoning";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl">
      <Reasoning defaultOpen>
        <ReasoningTrigger>Thought for 12 seconds</ReasoningTrigger>
        <ReasoningContent>
          <p>
            The user is asking about the difference between a list and a tuple
            in Python. I'll keep the answer focused on three points: mutability,
            syntax, and when to pick one over the other. I should avoid going
            into uncommon edge cases unless they ask a follow-up.
          </p>
        </ReasoningContent>
      </Reasoning>
    </div>
  );
}
