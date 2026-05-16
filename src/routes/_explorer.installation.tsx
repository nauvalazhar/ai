import { createFileRoute } from "@tanstack/react-router";
import { DocsView } from "#/components/playground/docs-view";
import { findComponentDocs } from "#/components/playground/registry";

export const Route = createFileRoute("/_explorer/installation")({
  component: InstallationDocs,
  head: () => ({
    meta: [{ title: "Installation — ai-kit" }],
  }),
});

function InstallationDocs() {
  const entry = findComponentDocs("installation");

  if (!entry) {
    return (
      <div className="min-h-dvh flex items-center justify-center md:p-8 max-sm:px-4 text-muted-foreground">
        <p className="text-sm">Installation docs not found.</p>
      </div>
    );
  }

  return (
    <div className="md:p-8 py-8 max-sm:px-4">
      <DocsView title="Installation" entry={entry} />
    </div>
  );
}
