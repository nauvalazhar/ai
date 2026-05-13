import { Loader } from "#/components/ai/loader";

export default function Colors() {
  return (
    <div className="flex flex-col items-start gap-3 text-sm">
      <Loader variant="pulse">Considering</Loader>
      <Loader variant="pulse" className="text-foreground">
        Pondering
      </Loader>
      <Loader variant="pulse" className="text-primary">
        Cogitating
      </Loader>

      <Loader variant="shimmer">Brewing</Loader>
      <Loader variant="shimmer" className="text-foreground">
        Crystallizing
      </Loader>
      <Loader variant="shimmer" className="text-primary">
        Synthesizing
      </Loader>

      <Loader dots className="text-emerald-500">
        Sprouting
      </Loader>
      <Loader dots className="text-orange-500">
        Flambéing
      </Loader>
    </div>
  );
}
