import { Suggestion } from "#/components/ai/suggestion";
import { CornerDownRightIcon } from "lucide-react";

const items = [
  "Tell me a joke",
  "Plan a weekend trip",
  "Write a haiku",
  "Explain quantum entanglement",
  "Draft a follow-up email",
];

export default function Column() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col items-start gap-2.5 py-10">
      {items.map((item) => (
        <Suggestion key={item} variant="plain">
          <CornerDownRightIcon />
          {item}
        </Suggestion>
      ))}
    </div>
  );
}
