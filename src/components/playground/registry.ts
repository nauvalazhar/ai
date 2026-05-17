import type { ReactElement } from "react";
import type { MDXProps } from "mdx/types";
import type { ComponentDocs } from "./docs-types";
import {
  registry,
  type ComponentEntry,
  type DemoEntry,
} from "./registry.config";

export type MDXContent = (props: MDXProps) => ReactElement;
type MdxModule = { default: MDXContent; frontmatter: ComponentDocs };

export type DocsEntry = {
  Component: MDXContent;
  frontmatter: ComponentDocs;
  source: string;
};

const sources = import.meta.glob("/src/demos/**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const componentSources = import.meta.glob("/src/components/ai/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const mdxModules = import.meta.glob<MdxModule>("/src/docs/**/*.mdx", {
  eager: true,
});

const mdxSources = import.meta.glob("/src/docs/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const componentDocs: Record<string, DocsEntry> = Object.entries(
  mdxModules,
).reduce(
  (acc, [path, mod]) => {
    const match = path.match(/\/src\/docs\/(.+)\.mdx$/);
    if (!match) return acc;
    acc[match[1]] = {
      Component: mod.default,
      frontmatter: mod.frontmatter,
      source: mdxSources[path] ?? "",
    };
    return acc;
  },
  {} as Record<string, DocsEntry>,
);

const components: ComponentEntry[] = registry.flatMap((g) => g.components);

export function findComponent(slug: string): ComponentEntry | undefined {
  return components.find((c) => c.slug === slug);
}

export function findDemo(
  component: string,
  demo: string,
): DemoEntry | undefined {
  return findComponent(component)?.demos.find((d) => d.slug === demo);
}

export function findDemoSource(
  component: string,
  demo: string,
): string | undefined {
  return sources[`/src/demos/${component}/${demo}.tsx`];
}

export function findComponentDocs(component: string): DocsEntry | undefined {
  return componentDocs[component];
}

export function findComponentSource(slug: string): string | undefined {
  return componentSources[`/src/components/ai/${slug}.tsx`];
}

export function findInstallationDoc(framework?: string): DocsEntry | undefined {
  if (!framework) return componentDocs["installation"];
  return componentDocs[`installation/${framework}`];
}

export const installationFrameworks: Array<{ slug: string; label: string }> = [
  { slug: "vite", label: "Vite" },
  { slug: "next", label: "Next.js" },
  { slug: "react-router", label: "React Router" },
  { slug: "tanstack-start", label: "TanStack Start" },
  { slug: "shadcn", label: "shadcn CLI" },
  { slug: "manual", label: "Manual" },
];
