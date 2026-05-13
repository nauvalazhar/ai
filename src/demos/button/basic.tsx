import { Button } from "#/components/ai/button";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl flex flex-wrap items-center gap-2">
      <Button>Send</Button>
      <Button variant="secondary">Regenerate</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="outline">Learn more</Button>
    </div>
  );
}
