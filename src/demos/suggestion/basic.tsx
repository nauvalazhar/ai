import { Suggestion } from "#/components/ai/suggestion";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl flex items-start gap-4 py-10 justify-center">
      <Suggestion>Write a poem</Suggestion>
      <Suggestion>Summarize this article</Suggestion>
      <Suggestion>Generate a picture</Suggestion>
    </div>
  );
}
