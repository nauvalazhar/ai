import { ScrollArea } from "#/components/ai/scroll-area";

const lines = Array.from({ length: 40 }, (_, i) => `Line ${i + 1}`);

export default function Basic() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 py-10">
      <div className="text-sm text-muted-foreground">
        A fixed-height container with a custom scrollbar that fades in on hover
        or while scrolling.
      </div>
      <ScrollArea className="h-64 rounded-outer ring ring-border bg-surface">
        <div className="flex flex-col gap-2 p-4 text-sm">
          {lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
