# aikit conventions

Rules every component in `src/components/ai/` follows. Read this before adding or editing a component.

## Philosophy

- **No data contract.** Components know layout and visual state — never message shape, parts arrays, or SDK types. Users compose: `<Message><Markdown>{streaming}</Markdown></Message>`.
- **Heavy renderers are siblings, not internals.** `<Markdown>`, `<CodeBlock>`, `<Math>` are first-class kit components. If a user doesn't render `<Markdown>`, they don't pay for it.
- **Base UI for real interactions only.** Collapsible (Reasoning, Tool*), ScrollArea (Thread), Popover (Sources), Dialog. Most components are styled `<div>`s.

## File structure

- `src/components/ai/<component>.tsx` — the kit component (registry source — what ships)
- `src/demos/<component>/<demo-name>.tsx` — one file per demo, default-exports a self-contained example
- `src/docs/<component>.mdx` — the docs page. Frontmatter holds `parts/props` (structured); body holds prose, anatomy code fence, and `<Props name="X" />` placeholders for the prop tables.
- `src/components/playground/*` — playground-only UI (sidebar, code view, etc.). Never shipped in the registry.

Example layout for the Message family:

```
src/components/ai/message.tsx
src/docs/message.mdx
src/demos/message/basic.tsx
src/demos/message/with-actions.tsx
src/demos/message/streaming.tsx
```

The playground discovers demos via a glob import (`import.meta.glob('/src/demos/**/*.tsx')`) and docs via `import.meta.glob('/src/docs/*.mdx')`. Sidebar shows the component, expanding to its list of demos. Demo file names become the demo labels (kebab-case → Title Case).

## Component pattern

```tsx
import { cn } from "#/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const messageVariants = cva("flex gap-3 px-4 py-3 rounded-md", {
  variants: {
    size: { sm: "text-sm", md: "text-base" },
  },
  defaultVariants: { size: "md" },
});

export function Message({
  size,
  className,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof messageVariants>) {
  return (
    <div
      data-slot="message"
      className={cn(messageVariants({ size, className }))}
      {...props}
    />
  );
}
```

Rules:

1. **Wrap a Base UI primitive when interactive**, otherwise plain `<div>` / `<button>` / `<span>`.
2. **Always set `data-slot`** to the part name (`message`, `message-avatar`, `tool-call`, `tool-call-trigger`).
3. **Use `data-role` for semantic role** (`data-role="user"`, `data-role="assistant"`).
4. **Use `data-state` for transient state** (`data-state="running"`, `data-state="error"`).
5. **Use `cva` for visual variants only** (size, density). Never for state or role — those are data attributes.
6. **Forward `className` last** through `cn(...)` so users can override.
7. **Forward all other props** via `{...props}`.

## Tokens

Color and radius come from CSS variables defined in `src/styles.css`. Token names align with shadcn/selia so our kit drops into existing themes without remapping.

- Page: `bg-background`, `text-foreground`
- Subtle: `bg-muted`, `text-muted-foreground`
- Raised: `bg-card`, `text-card-foreground` (used for message bubbles, tool panels, popovers)
- Border: `border-border`
- Primary: `bg-primary`, `text-primary-foreground` (CTAs, focus ring, accents)

**Radius is a single value.** Every component rounds with `rounded-md`. No `rounded-sm`, no `rounded-lg`, no `rounded-xl`. The only exception is `rounded-full` for circles (avatar, dot indicators). To re-round the entire kit, the user overrides `--radius` once.

**Never hardcode** raw Tailwind colors (`bg-zinc-100`, `text-black`) or other radii (`rounded-xl`) in component source.

For padding, gap, and sizing, use raw Tailwind utilities inline (`px-4 py-2`, `gap-3`, `size-8`). These are not tokenized — they're context-dependent and the user owns the source if they need to change them.

## Compound components

Export named parts at the top level. We don't use namespace exports — flat exports keep imports explicit and tree-shakable:

```tsx
// good
export function Message({ ... }) { ... }
export function MessageAvatar({ ... }) { ... }
export function MessageContent({ ... }) { ... }

// usage
import { Message, MessageAvatar, MessageContent } from "#/components/ai/message";
```

One file per component family.

## Customization model (for kit users)

Three paths, in order of how often they'll be reached for:

1. **Edit the file.** It's their copy — they own it. This is the default.
2. **Override per-instance** via `className`. `tailwind-merge` dedupes:
   ```tsx
   <Message className="px-6 py-3 rounded-lg">
   ```
3. **Target via `data-slot`** in their own CSS, when they want to retone the whole kit:
   ```css
   [data-slot="message"][data-role="assistant"] { background: ...; }
   ```

For visual identity (colors, radius), users override the CSS variables in `:root` or `.dark`. Names match shadcn/selia, so an existing theme works as-is.
