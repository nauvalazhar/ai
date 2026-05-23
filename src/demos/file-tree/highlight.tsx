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
    name: "src",
    path: "src",
    children: [
      { kind: "file", name: "App.tsx", path: "src/App.tsx" },
      { kind: "file", name: "main.tsx", path: "src/main.tsx" },
      {
        kind: "folder",
        name: "hooks",
        path: "src/hooks",
        children: [
          { kind: "file", name: "useAuth.ts", path: "src/hooks/useAuth.ts" },
          { kind: "file", name: "useQuery.ts", path: "src/hooks/useQuery.ts" },
        ],
      },
    ],
  },
  { kind: "file", name: "tsconfig.json", path: "tsconfig.json" },
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

export default function Highlight() {
  const [opened, setOpened] = useState<string | null>(null);

  return (
    <div className="max-w-sm mx-auto flex flex-col gap-3">
      <FileTree
        highlight
        defaultExpanded={["src", "src/hooks"]}
        defaultHighlighted="src"
        onActivate={(value, kind) => {
          if (kind === "file") setOpened(value);
        }}
      >
        {tree.map(renderNode)}
      </FileTree>
      <p className="text-xs text-muted-foreground text-center">
        Tab into the tree, then arrow keys navigate. Enter opens a file.
        {" "}
        {opened ? (
          <span className="text-foreground font-mono">{opened}</span>
        ) : (
          "Nothing opened yet."
        )}
      </p>
    </div>
  );
}
