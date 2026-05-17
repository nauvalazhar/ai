import { createFileRoute } from "@tanstack/react-router";
import { DocsView } from "#/components/playground/docs-view";
import {
  findInstallationDoc,
  installationFrameworks,
} from "#/components/playground/registry";

export const Route = createFileRoute("/_explorer/installation/{-$framework}")({
  component: InstallationDocs,
  head: ({ params }) => {
    const fw = params.framework
      ? installationFrameworks.find((f) => f.slug === params.framework)
      : undefined;
    const title = fw
      ? (fw.title ?? `Install on ${fw.label}`)
      : "Installation";
    return { meta: [{ title: `${title} — nauvalazhar/ai` }] };
  },
});

function InstallationDocs() {
  const { framework } = Route.useParams();
  const entry = findInstallationDoc(framework);
  const fw = framework
    ? installationFrameworks.find((f) => f.slug === framework)
    : undefined;

  if (!entry) {
    return (
      <div className="min-h-dvh flex items-center justify-center md:p-8 max-sm:px-4 text-muted-foreground">
        <p className="text-sm">Installation page not found.</p>
      </div>
    );
  }

  const title = fw
    ? (fw.title ?? `Install on ${fw.label}`)
    : "Installation";

  return (
    <div className="md:p-8 py-8 max-sm:px-4">
      <DocsView title={title} entry={entry} />
    </div>
  );
}
