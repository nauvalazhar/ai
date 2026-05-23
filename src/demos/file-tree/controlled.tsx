import { FileTextIcon, FolderIcon } from "lucide-react";
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
    name: "packages",
    path: "packages",
    children: [
      {
        kind: "folder",
        name: "ui",
        path: "packages/ui",
        children: [
          {
            kind: "file",
            name: "package.json",
            path: "packages/ui/package.json",
          },
          {
            kind: "file",
            name: "tsconfig.json",
            path: "packages/ui/tsconfig.json",
          },
        ],
      },
      {
        kind: "folder",
        name: "app",
        path: "packages/app",
        children: [
          {
            kind: "file",
            name: "package.json",
            path: "packages/app/package.json",
          },
        ],
      },
    ],
  },
  { kind: "file", name: "pnpm-workspace.yaml", path: "pnpm-workspace.yaml" },
];

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
      <FileTreeFolderPanel>
        {node.children.map(renderNode)}
      </FileTreeFolderPanel>
    </FileTreeFolder>
  );
}

export default function Controlled() {
  const [expanded, setExpanded] = useState<string[]>(["packages"]);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-3">
      <FileTree
        expanded={expanded}
        onExpandedChange={setExpanded}
        selected={selected}
        onSelectedChange={setSelected}
      >
        {tree.map(renderNode)}
      </FileTree>
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>
          Open:{" "}
          <span className="text-foreground font-mono">
            {expanded.length ? expanded.join(", ") : "none"}
          </span>
        </p>
        <p>
          Selected:{" "}
          <span className="text-foreground font-mono">
            {selected ?? "none"}
          </span>
        </p>
      </div>
    </div>
  );
}
