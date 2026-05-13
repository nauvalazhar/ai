export type PropDoc = {
  name: string;
  type: string;
  default?: string;
  description?: string;
};

export type PassThrough = {
  /** TypeScript type as displayed, e.g. `React.ComponentProps<"div">`. */
  type: string;
  /**
   * Underlying element or component used in the auto-generated description.
   * Use `<div>` style for HTML elements, or `Collapsible.Trigger` for components.
   * Ignored when `description` is set.
   */
  to?: string;
  /** Override the default description. */
  description?: string;
  /** Optional link to upstream docs (e.g., Base UI). */
  docsUrl?: { label: string; href: string };
};

export type Part = {
  name: string;
  props?: PropDoc[];
  passThrough?: PassThrough;
};

export type ComponentDocs = {
  parts: Part[];
};
