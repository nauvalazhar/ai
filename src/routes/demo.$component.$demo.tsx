import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "#/components/ai/loader";
import { findComponent, findDemo } from "#/components/playground/registry";

export const Route = createFileRoute("/demo/$component/$demo")({
  component: DemoStandalone,
  head: ({ params }) => {
    const componentName =
      findComponent(params.component)?.name ?? params.component;
    const demoName =
      findDemo(params.component, params.demo)?.name ?? params.demo;
    return {
      meta: [{ title: `${componentName} · ${demoName}` }],
    };
  },
});

function DemoStandalone() {
  const { component, demo } = Route.useParams();
  const found = findDemo(component, demo);

  if (!found) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Demo not found:{" "}
          <code className="font-mono">
            {component}/{demo}
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="isolate px-2.5">
      <div className="h-20 shrink-0" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12 text-sm">
            <Loader variant="shimmer">Loading</Loader>
          </div>
        }
      >
        <found.Component />
      </Suspense>
    </div>
  );
}
