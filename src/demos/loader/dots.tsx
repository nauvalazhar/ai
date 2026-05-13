import { Loader } from "#/components/ai/loader";

export default function Dots() {
  return (
    <div className="flex items-center text-sm">
      <Loader dots>Thinking</Loader>
    </div>
  );
}
