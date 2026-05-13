import { Copy, Download, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import { Button } from "#/components/ai/button";
import {
  Document,
  DocumentAction,
  DocumentContent,
  DocumentHeader,
  DocumentTitle,
} from "#/components/ai/document";

const plan = `## Add Command Palette (Cmd+K)

### Summary

Add a global command palette to the app, opened with Cmd+K (or Ctrl+K on Windows and Linux). It lets the user jump to any page, run common actions, and pull up recent items without leaving the keyboard.

### Implementation Changes

- Add the palette component in \`src/components/command-palette.tsx\`:
  - Mount it at the root so it overlays any route.
  - Render through a portal so it sits above existing dialogs.
- Wire the global hotkey in \`src/hooks/use-command-palette.ts\`:
  - Listen for Cmd+K and Ctrl+K and toggle the palette open.
  - Skip the shortcut when focus is inside an input or contenteditable.
- Register actions in \`src/lib/commands.ts\`:
  - Pull navigation entries from the existing route manifest.
  - Let feature modules register their own commands at boot.
- Surface recent items from the activity log:
  - Read the last 10 viewed items from local storage and put them at the top.
  - Update the log whenever a route view is recorded.

### Acceptance

- Cmd+K opens and closes the palette from anywhere in the app.
- Typing filters navigation, actions, and recent items in a single list.
- The first match is preselected and Enter triggers it.
- Esc closes the palette and returns focus to the previously focused element.
`;

export default function ExternalTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="relative">
        <Document open={open} onOpenChange={setOpen} collapsedHeight={260}>
          <DocumentHeader>
            <DocumentTitle>Plan</DocumentTitle>
            <DocumentAction>
              <Button
                iconOnly
                variant="ghost"
                aria-label="Download"
                className="text-muted-foreground hover:text-foreground"
              >
                <Download />
              </Button>
              <Button
                iconOnly
                variant="ghost"
                aria-label="Copy"
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy />
              </Button>
              <Button
                iconOnly
                variant="ghost"
                aria-label="Helpful"
                className="text-muted-foreground hover:text-foreground"
              >
                <ThumbsUp />
              </Button>
              <Button
                iconOnly
                variant="ghost"
                aria-label="Not helpful"
                className="text-muted-foreground hover:text-foreground"
              >
                <ThumbsDown />
              </Button>
            </DocumentAction>
          </DocumentHeader>
          <DocumentContent>
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-medium prose-h2:text-lg prose-h2:mt-0 prose-h3:text-sm prose-h3:mt-4">
              <Markdown>{plan}</Markdown>
            </div>
          </DocumentContent>
        </Document>

        <Button
          variant="secondary"
          onClick={() => setOpen((o) => !o)}
          className="absolute left-1/2 bottom-4 -translate-x-1/2 rounded-full bg-foreground hover:bg-foreground/90 text-background text-xs shadow-sm"
        >
          {open ? "Collapse plan" : "Expand plan"}
        </Button>
      </div>
    </div>
  );
}
