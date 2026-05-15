import { useState } from "react";
import { ArrowUpIcon, FileCodeIcon, FileTextIcon, FolderIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Composer,
  ComposerSubmit,
  ComposerToolbar,
  ComposerToolbarSpacer,
} from "#/components/ai/composer";
import {
  ComposerRichInput,
  ComposerSuggestions,
  type ComposerItem,
} from "#/components/ai/composer-rich";

const allFiles: ComposerItem[] = [
  { id: "1", label: "src/components/ai/button.tsx", icon: <FileCodeIcon /> },
  { id: "2", label: "src/components/ai/composer.tsx", icon: <FileCodeIcon /> },
  { id: "3", label: "src/components/ai/citation.tsx", icon: <FileCodeIcon /> },
  { id: "4", label: "src/components/ai/message.tsx", icon: <FileCodeIcon /> },
  { id: "5", label: "src/lib/utils.ts", icon: <FileCodeIcon /> },
  { id: "6", label: "src/routes/__root.tsx", icon: <FileCodeIcon /> },
  { id: "7", label: "src/styles/tokens.css", icon: <FileTextIcon /> },
  { id: "8", label: "README.md", icon: <FileTextIcon /> },
  { id: "9", label: "package.json", icon: <FileTextIcon /> },
  { id: "10", label: "public/", icon: <FolderIcon /> },
  { id: "11", label: "src/components/playground/", icon: <FolderIcon /> },
];

function fetchFiles(query: string) {
  return new Promise<ComposerItem[]>((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase();
      resolve(allFiles.filter((f) => !q || f.label.toLowerCase().includes(q)));
    }, 240);
  });
}

export default function Async() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-12">
      <Composer>
        <ComposerRichInput
          placeholder="Type @ to search files. Results are loaded async."
          onSubmit={(value) => setLast(value.text)}
          triggers={{
            "@": {
              items: fetchFiles,
              filter: () => true,
            },
          }}
        />
        <ComposerSuggestions />
        <ComposerToolbar>
          <ComposerToolbarSpacer>
            <ComposerSubmit render={<Button iconOnly className="rounded-full" />}>
              <ArrowUpIcon />
            </ComposerSubmit>
          </ComposerToolbarSpacer>
        </ComposerToolbar>
      </Composer>

      {last ? (
        <div className="rounded-outer border border-border bg-surface p-3 text-xs">
          <div className="mb-1.5 text-muted-foreground">Last submitted</div>
          <pre className="whitespace-pre-wrap text-foreground">{last}</pre>
        </div>
      ) : null}
    </div>
  );
}
