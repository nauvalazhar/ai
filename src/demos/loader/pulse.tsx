import { Loader } from "#/components/ai/loader";

export default function Pulse() {
  return (
    <div className="flex items-center text-sm">
      <Loader variant="pulse">Thinking</Loader>
    </div>
  );
}
