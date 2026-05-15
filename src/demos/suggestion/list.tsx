import { Suggestion } from "#/components/ai/suggestion";

const items = [
  "Summarize this article",
  "Explain quantum entanglement",
  "Draft a follow-up email",
  "Plan a weekend trip",
  "Write a haiku",
];

export default function List() {
  return (
    <div className="mx-auto max-w-md flex flex-col items-stretch gap-3 py-10">
      <Suggestion className="self-start">Summarize</Suggestion>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <Suggestion
            key={item}
            variant="list"
            highlight="how to"
            onClick={() => {}}
          >
            {item}
          </Suggestion>
        ))}
      </div>
    </div>
  );
}
