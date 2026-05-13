import { Loader } from "#/components/ai/loader";

export default function Shimmer() {
  return (
    <div className="flex items-center text-sm">
      <Loader variant="shimmer">Thinking</Loader>
    </div>
  );
}
