import { Loader } from "#/components/ai/loader";

export default function Combined() {
  return (
    <div className="flex flex-col items-start gap-3 text-sm">
      <Loader variant="pulse" dots>
        Thinking
      </Loader>
      <Loader variant="shimmer" dots>
        Reasoning
      </Loader>
    </div>
  );
}
