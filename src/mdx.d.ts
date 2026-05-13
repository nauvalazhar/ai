declare module "*.mdx" {
  import type { ReactElement } from "react";
  import type { MDXProps } from "mdx/types";
  import type { ComponentDocs } from "#/components/playground/docs-types";

  export const frontmatter: ComponentDocs;
  const MDXComponent: (props: MDXProps) => ReactElement;
  export default MDXComponent;
}

declare module "*.mdx?raw" {
  const content: string;
  export default content;
}
