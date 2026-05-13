import { Loader } from "#/components/ai/loader";

export default function Tuning() {
  return (
    <div className="flex flex-col items-start gap-6 text-sm">
      <section className="flex flex-col gap-2">
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
          Duration
        </h3>
        <Loader variant="shimmer" duration={1}>
          Fast (1s)
        </Loader>
        <Loader variant="shimmer">Default (2.2s)</Loader>
        <Loader variant="shimmer" duration={4}>
          Slow (4s)
        </Loader>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
          Spread
        </h3>
        <Loader variant="shimmer" spread={10}>
          Narrow band (10%)
        </Loader>
        <Loader variant="shimmer">Default (40%)</Loader>
        <Loader variant="shimmer" spread={80}>
          Wide band (80%)
        </Loader>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
          Pulse + dots, slowed down
        </h3>
        <Loader variant="pulse" dots duration={2.5}>
          Marinating
        </Loader>
      </section>
    </div>
  );
}
