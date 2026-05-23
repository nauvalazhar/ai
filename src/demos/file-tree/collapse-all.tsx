import { ChevronsDownUpIcon, ChevronsUpDownIcon, FileTextIcon, FolderIcon } from "lucide-react";
import { useState } from "react";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  FileTreeFolderPanel,
  FileTreeRow,
  FileTreeIcon,
  FileTreeLabel,
} from "#/components/ai/file-tree";

type Node =
  | { kind: "file"; name: string; path: string }
  | { kind: "folder"; name: string; path: string; children: Node[] };

const tree: Node[] = [
  {
    kind: "folder",
    name: "src",
    path: "src",
    children: [
      {
        kind: "folder",
        name: "components",
        path: "src/components",
        children: [
          { kind: "file", name: "header.tsx", path: "src/components/header.tsx" },
          { kind: "file", name: "footer.tsx", path: "src/components/footer.tsx" },
        ],
      },
      {
        kind: "folder",
        name: "lib",
        path: "src/lib",
        children: [
          { kind: "file", name: "fetch.ts", path: "src/lib/fetch.ts" },
          { kind: "file", name: "cn.ts", path: "src/lib/cn.ts" },
        ],
      },
      { kind: "file", name: "index.ts", path: "src/index.ts" },
    ],
  },
  { kind: "file", name: "package.json", path: "package.json" },
];

function allFolderPaths(nodes: Node[]): string[] {
  const out: string[] = [];
  function walk(node: Node) {
    if (node.kind !== "folder") return;
    out.push(node.path);
    node.children.forEach(walk);
  }
  nodes.forEach(walk);
  return out;
}

function renderNode(node: Node) {
  if (node.kind === "file") {
    return (
      <FileTreeFile key={node.path} value={node.path}>
        <FileTreeRow>
          <FileTreeIcon>
            <FileTextIcon />
          </FileTreeIcon>
          <FileTreeLabel>{node.name}</FileTreeLabel>
        </FileTreeRow>
      </FileTreeFile>
    );
  }
  return (
    <FileTreeFolder key={node.path} value={node.path}>
      <FileTreeRow>
        <FileTreeIcon>
          <FolderIcon />
        </FileTreeIcon>
        <FileTreeLabel>{node.name}</FileTreeLabel>
      </FileTreeRow>
      <FileTreeFolderPanel>{node.children.map(renderNode)}</FileTreeFolderPanel>
    </FileTreeFolder>
  );
}

export default function CollapseAll() {
  const [expanded, setExpanded] = useState<string[]>(["src"]);
  const folders = allFolderPaths(tree);
  const allOpen = folders.every((f) => expanded.includes(f));

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setExpanded(allOpen ? [] : folders)}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
        >
          {allOpen ? (
            <ChevronsDownUpIcon className="size-3.5" />
          ) : (
            <ChevronsUpDownIcon className="size-3.5" />
          )}
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <FileTree expanded={expanded} onExpandedChange={setExpanded}>
        {tree.map(renderNode)}
      </FileTree>
    </div>
  );
}
