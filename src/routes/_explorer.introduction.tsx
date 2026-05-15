import { createFileRoute } from "@tanstack/react-router";
import { DocsView } from "#/components/playground/docs-view";
import { findComponentDocs } from "#/components/playground/registry";

export const Route = createFileRoute("/_explorer/introduction")({
  component: IntroductionDocs,
  head: () => ({
    meta: [{ title: "Introduction — ai-kit" }],
  }),
});

function IntroductionDocs() {
  const entry = findComponentDocs("introduction");

  if (!entry) {
    return (
      <div className="min-h-dvh flex items-center justify-center md:p-8 max-sm:px-4 text-muted-foreground">
        <p className="text-sm">Introduction docs not found.</p>
      </div>
    );
  }

  return (
    <div className="md:p-8 py-8 max-sm:px-4">
      <DocsView title="Introduction" entry={entry} />
    </div>
  );
}
