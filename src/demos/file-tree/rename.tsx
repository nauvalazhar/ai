import {
  FilePlusIcon,
  FileTextIcon,
  FolderIcon,
  PencilIcon,
} from "lucide-react";
import { useState } from "react";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  FileTreeFolderPanel,
  FileTreeIcon,
  FileTreeLabel,
  FileTreeNew,
  FileTreeRow,
} from "#/components/ai/file-tree";

type FileItem = { id: string; name: string };

const initial: FileItem[] = [
  { id: "src/index.ts", name: "index.ts" },
  { id: "src/server.ts", name: "server.ts" },
  { id: "src/router.ts", name: "router.ts" },
];

export default function Rename() {
  const [files, setFiles] = useState<FileItem[]>(initial);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  function commitRename(id: string, name: string) {
    const trimmed = name.trim();
    if (trimmed) {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, name: trimmed } : f)),
      );
    }
    setRenamingId(null);
  }

  function commitCreate(name: string) {
    const trimmed = name.trim();
    if (trimmed) {
      setFiles((prev) => [
        ...prev,
        { id: `src/${trimmed}-${prev.length}`, name: trimmed },
      ]);
    }
    setCreating(false);
  }

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-3">
      <FileTree defaultExpanded={["src"]} defaultSelected="src/index.ts">
        <FileTreeFolder value="src">
          <FileTreeRow>
            <FileTreeIcon>
              <FolderIcon />
            </FileTreeIcon>
            <FileTreeLabel>src</FileTreeLabel>
            <button
              type="button"
              aria-label="New file"
              onClick={(event) => {
                event.stopPropagation();
                setCreating(true);
              }}
              className="ml-auto opacity-0 group-hover/file-tree-row:opacity-100 inline-flex items-center justify-center size-5 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-opacity"
            >
              <FilePlusIcon className="size-3.5" />
            </button>
          </FileTreeRow>
          <FileTreeFolderPanel>
            {files.map((f) => (
              <FileTreeFile
                key={f.id}
                value={f.id}
                renaming={renamingId === f.id}
              >
                <FileTreeRow>
                  <FileTreeIcon>
                    <FileTextIcon />
                  </FileTreeIcon>
                  {renamingId === f.id ? (
                    <input
                      autoFocus
                      defaultValue={f.name}
                      onBlur={(event) => commitRename(f.id, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitRename(f.id, event.currentTarget.value);
                        } else if (event.key === "Escape") {
                          event.preventDefault();
                          setRenamingId(null);
                        }
                      }}
                      className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none px-1 -mx-1"
                    />
                  ) : (
                    <>
                      <FileTreeLabel>{f.name}</FileTreeLabel>
                      <button
                        type="button"
                        aria-label={`Rename ${f.name}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          setRenamingId(f.id);
                        }}
                        className="ml-auto opacity-0 group-hover/file-tree-row:opacity-100 inline-flex items-center justify-center size-5 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-opacity"
                      >
                        <PencilIcon className="size-3" />
                      </button>
                    </>
                  )}
                </FileTreeRow>
              </FileTreeFile>
            ))}
            {creating && (
              <FileTreeNew>
                <FileTreeIcon>
                  <FileTextIcon />
                </FileTreeIcon>
                <input
                  autoFocus
                  placeholder="new file..."
                  onBlur={(event) => commitCreate(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commitCreate(event.currentTarget.value);
                    } else if (event.key === "Escape") {
                      event.preventDefault();
                      setCreating(false);
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none ring-1 ring-primary rounded px-1 -mx-1"
                />
              </FileTreeNew>
            )}
          </FileTreeFolderPanel>
        </FileTreeFolder>
      </FileTree>
      <p className="text-xs text-muted-foreground text-center">
        Hover a row for the rename and create buttons. Enter commits, Escape
        cancels.
      </p>
    </div>
  );
}
