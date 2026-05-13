import { Loader } from "#/components/ai/loader";

export default function Sizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <div className="text-xs">
        <Loader variant="shimmer" dots>
          Thinking
        </Loader>
      </div>
      <div className="text-sm">
        <Loader variant="shimmer" dots>
          Thinking
        </Loader>
      </div>
      <div className="text-base">
        <Loader variant="shimmer" dots>
          Thinking
        </Loader>
      </div>
      <div className="text-lg">
        <Loader variant="shimmer" dots>
          Thinking
        </Loader>
      </div>
      <div className="text-2xl">
        <Loader variant="shimmer" dots>
          Thinking
        </Loader>
      </div>
    </div>
  );
}
