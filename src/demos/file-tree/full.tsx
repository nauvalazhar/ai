import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  FilePlusIcon,
  FileTextIcon,
  FolderIcon,
  FolderPlusIcon,
  PencilIcon,
} from "lucide-react";
import { useState } from "react";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  FileTreeFolderPanel,
  FileTreeNew,
  FileTreeRow,
  FileTreeIcon,
  FileTreeLabel,
} from "#/components/ai/file-tree";

type FileNode = { kind: "file"; id: string; name: string };
type FolderNode = {
  kind: "folder";
  id: string;
  name: string;
  children: TreeNode[];
};
type TreeNode = FileNode | FolderNode;

const initial: TreeNode[] = [
  {
    kind: "folder",
    id: "src",
    name: "src",
    children: [
      { kind: "file", id: "src/App.tsx", name: "App.tsx" },
      { kind: "file", id: "src/main.tsx", name: "main.tsx" },
      {
        kind: "folder",
        id: "src/hooks",
        name: "hooks",
        children: [
          { kind: "file", id: "src/hooks/useAuth.ts", name: "useAuth.ts" },
          { kind: "file", id: "src/hooks/useQuery.ts", name: "useQuery.ts" },
        ],
      },
    ],
  },
  { kind: "file", id: "package.json", name: "package.json" },
  { kind: "file", id: "tsconfig.json", name: "tsconfig.json" },
];

const fileContent: Record<string, string> = {
  "src/App.tsx": `export function App() {
  return <h1>Hello, world</h1>;
}`,
  "src/main.tsx": `import { createRoot } from "react-dom/client";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);`,
  "src/hooks/useAuth.ts": `export function useAuth() {
  return { user: null };
}`,
  "src/hooks/useQuery.ts": `export function useQuery<T>(key: string): T | null {
  return null;
}`,
  "package.json": `{
  "name": "demo-app",
  "version": "0.0.1",
  "private": true
}`,
  "tsconfig.json": `{
  "compilerOptions": { "strict": true, "jsx": "react-jsx" }
}`,
};

function findNode(tree: TreeNode[], id: string): TreeNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.kind === "folder") {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function findParentId(
  tree: TreeNode[],
  id: string,
  parent: string | null = null,
): string | null | undefined {
  for (const node of tree) {
    if (node.id === id) return parent;
    if (node.kind === "folder") {
      const found = findParentId(node.children, id, node.id);
      if (found !== undefined) return found;
    }
  }
  return undefined;
}

function foldersFirst(nodes: TreeNode[]): TreeNode[] {
  return [
    ...nodes.filter((n) => n.kind === "folder"),
    ...nodes.filter((n) => n.kind === "file"),
  ];
}

function allFolderIds(tree: TreeNode[]): string[] {
  const out: string[] = [];
  function walk(node: TreeNode) {
    if (node.kind !== "folder") return;
    out.push(node.id);
    node.children.forEach(walk);
  }
  tree.forEach(walk);
  return out;
}

function insertChild(
  tree: TreeNode[],
  parentId: string | null,
  child: TreeNode,
): TreeNode[] {
  if (parentId === null) return [...tree, child];
  return tree.map((node) => {
    if (node.kind !== "folder") return node;
    if (node.id === parentId) {
      return { ...node, children: [...node.children, child] };
    }
    return { ...node, children: insertChild(node.children, parentId, child) };
  });
}

function renameInTree(
  tree: TreeNode[],
  id: string,
  name: string,
): TreeNode[] {
  return tree.map((node) => {
    if (node.id === id) return { ...node, name };
    if (node.kind === "folder") {
      return { ...node, children: renameInTree(node.children, id, name) };
    }
    return node;
  });
}

export default function Full() {
  const [tree, setTree] = useState<TreeNode[]>(initial);
  const [expanded, setExpanded] = useState<string[]>(["src"]);
  const [selected, setSelected] = useState<string | null>("src/App.tsx");
  const [highlighted, setHighlighted] = useState<string | null>("src/App.tsx");
  const [opened, setOpened] = useState<string | null>("src/App.tsx");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [creating, setCreating] = useState<{
    parentId: string | null;
    kind: "file" | "folder";
  } | null>(null);

  const allFolders = allFolderIds(tree);
  const allOpen =
    allFolders.length > 0 && allFolders.every((id) => expanded.includes(id));

  function resolveCreateParent(): string | null {
    if (!selected) return null;
    const node = findNode(tree, selected);
    if (!node) return null;
    if (node.kind === "folder") return node.id;
    return findParentId(tree, node.id) ?? null;
  }

  function startCreate(kind: "file" | "folder") {
    const parentId = resolveCreateParent();
    if (parentId !== null) {
      setExpanded((prev) =>
        prev.includes(parentId) ? prev : [...prev, parentId],
      );
    }
    setRenamingId(null);
    setCreating({ parentId, kind });
  }

  function commitCreate(name: string) {
    if (!creating) return;
    const trimmed = name.trim();
    if (trimmed) {
      const baseId = creating.parentId
        ? `${creating.parentId}/${trimmed}`
        : trimmed;
      const id = `${baseId}-${Date.now()}`;
      const child: TreeNode =
        creating.kind === "file"
          ? { kind: "file", id, name: trimmed }
          : { kind: "folder", id, name: trimmed, children: [] };
      setTree((prev) => insertChild(prev, creating.parentId, child));
    }
    setCreating(null);
  }

  function commitRename(id: string, name: string) {
    const trimmed = name.trim();
    if (trimmed) {
      setTree((prev) => renameInTree(prev, id, trimmed));
    }
    setRenamingId(null);
  }

  function renderNode(node: TreeNode): React.ReactElement {
    const isRenaming = renamingId === node.id;
    const labelInput = (
      <input
        autoFocus
        defaultValue={node.name}
        onBlur={(event) => commitRename(node.id, event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitRename(node.id, event.currentTarget.value);
          } else if (event.key === "Escape") {
            event.preventDefault();
            setRenamingId(null);
          }
        }}
        onClick={(event) => event.stopPropagation()}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none ring-1 ring-primary rounded px-1 -mx-1"
      />
    );

    const renameButton = (
      <button
        type="button"
        aria-label={`Rename ${node.name}`}
        onClick={(event) => {
          event.stopPropagation();
          setRenamingId(node.id);
        }}
        className="ml-auto opacity-0 group-hover/file-tree-row:opacity-100 group-data-highlighted/file-tree-row:opacity-100 inline-flex items-center justify-center size-5 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-opacity"
      >
        <PencilIcon className="size-3" />
      </button>
    );

    if (node.kind === "file") {
      return (
        <FileTreeFile key={node.id} value={node.id} renaming={isRenaming}>
          <FileTreeRow>
            <FileTreeIcon>
              <FileTextIcon />
            </FileTreeIcon>
            {isRenaming ? (
              labelInput
            ) : (
              <>
                <FileTreeLabel>{node.name}</FileTreeLabel>
                {renameButton}
              </>
            )}
          </FileTreeRow>
        </FileTreeFile>
      );
    }

    return (
      <FileTreeFolder
        key={node.id}
        value={node.id}
        renaming={isRenaming}
      >
        <FileTreeRow>
          <FileTreeIcon>
            <FolderIcon />
          </FileTreeIcon>
          {isRenaming ? (
            labelInput
          ) : (
            <>
              <FileTreeLabel>{node.name}</FileTreeLabel>
              {renameButton}
            </>
          )}
        </FileTreeRow>
        <FileTreeFolderPanel>
          {foldersFirst(node.children).map(renderNode)}
          {creating?.parentId === node.id && (
            <FileTreeNew>
              <FileTreeIcon>
                {creating.kind === "file" ? <FileTextIcon /> : <FolderIcon />}
              </FileTreeIcon>
              <input
                autoFocus
                placeholder={
                  creating.kind === "file" ? "new file..." : "new folder..."
                }
                onBlur={(event) => commitCreate(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitCreate(event.currentTarget.value);
                  } else if (event.key === "Escape") {
                    event.preventDefault();
                    setCreating(null);
                  }
                }}
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none ring-1 ring-primary rounded px-1 -mx-1"
              />
            </FileTreeNew>
          )}
        </FileTreeFolderPanel>
      </FileTreeFolder>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="ring ring-border rounded-outer overflow-hidden bg-surface grid grid-cols-[16rem_1fr] min-h-[24rem]">
        <div className="border-r border-border flex flex-col">
          <header className="flex items-center gap-1 px-2 h-10 border-b border-border">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex-1 px-1">
              Explorer
            </span>
            <button
              type="button"
              aria-label="New file"
              onClick={() => startCreate("file")}
              className="inline-flex items-center justify-center size-6 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <FilePlusIcon className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="New folder"
              onClick={() => startCreate("folder")}
              className="inline-flex items-center justify-center size-6 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              <FolderPlusIcon className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label={allOpen ? "Collapse all" : "Expand all"}
              onClick={() => setExpanded(allOpen ? [] : allFolders)}
              className="inline-flex items-center justify-center size-6 rounded text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
            >
              {allOpen ? (
                <ChevronsDownUpIcon className="size-3.5" />
              ) : (
                <ChevronsUpDownIcon className="size-3.5" />
              )}
            </button>
          </header>
          <FileTree
            highlight
            guides
            expanded={expanded}
            onExpandedChange={setExpanded}
            selected={selected}
            onSelectedChange={setSelected}
            highlighted={highlighted}
            onHighlightedChange={setHighlighted}
            onActivate={(value, kind) => {
              if (kind === "file") setOpened(value);
            }}
            onKeyDown={(event) => {
              if (
                event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement
              ) {
                return;
              }
              if (event.key === "F2" && highlighted) {
                event.preventDefault();
                setRenamingId(highlighted);
              }
            }}
            className="flex-1 rounded-none ring-0 bg-transparent p-1 overflow-auto"
          >
            {foldersFirst(tree).map(renderNode)}
            {creating?.parentId === null && (
              <FileTreeNew>
                <FileTreeIcon>
                  {creating.kind === "file" ? <FileTextIcon /> : <FolderIcon />}
                </FileTreeIcon>
                <input
                  autoFocus
                  placeholder={
                    creating.kind === "file" ? "new file..." : "new folder..."
                  }
                  onBlur={(event) => commitCreate(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commitCreate(event.currentTarget.value);
                    } else if (event.key === "Escape") {
                      event.preventDefault();
                      setCreating(null);
                    }
                  }}
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none ring-1 ring-primary rounded px-1 -mx-1"
                />
              </FileTreeNew>
            )}
          </FileTree>
        </div>
        <div className="flex flex-col">
          <header className="flex items-center px-3 h-10 border-b border-border">
            <span className="text-xs font-mono text-muted-foreground truncate">
              {opened ?? "no file open"}
            </span>
          </header>
          <div className="flex-1 p-4 font-mono text-xs text-foreground/90 overflow-auto whitespace-pre">
            {opened && fileContent[opened]
              ? fileContent[opened]
              : opened
                ? "// new file, no content yet"
                : "// pick a file from the tree"}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground text-center">
        Tab into the tree for arrow-key nav. F2 renames the highlighted row. The toolbar adds a file or folder inside the selected folder, or at the root.
      </p>
    </div>
  );
}
