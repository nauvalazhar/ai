import { createFileRoute } from "@tanstack/react-router";
import { DocsView } from "#/components/playground/docs-view";
import {
  findComponent,
  findComponentDocs,
} from "#/components/playground/registry";

export const Route = createFileRoute("/_explorer/$component/")({
  component: ComponentDocs,
  head: ({ params }) => ({
    meta: [
      {
        title: `${findComponent(params.component)?.name ?? params.component} — nauvalazhar/ai`,
      },
    ],
  }),
});

function ComponentDocs() {
  const { component } = Route.useParams();
  const entry = findComponentDocs(component);
  const name = findComponent(component)?.name ?? component;

  if (!entry) {
    return (
      <div className="min-h-dvh flex items-center justify-center md:p-8 max-sm:px-4 text-muted-foreground">
        <p className="text-sm">
          No docs for <code className="font-mono">{name}</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="md:p-8 py-8 max-sm:px-4">
      <DocsView title={name} entry={entry} />
    </div>
  );
}
