import { FileTextIcon, FolderIcon } from "lucide-react";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  FileTreeFolderPanel,
  FileTreeIcon,
  FileTreeLabel,
  FileTreeRow,
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
          { kind: "file", name: "button.tsx", path: "src/components/button.tsx" },
          { kind: "file", name: "input.tsx", path: "src/components/input.tsx" },
          { kind: "file", name: "modal.tsx", path: "src/components/modal.tsx" },
        ],
      },
      {
        kind: "folder",
        name: "hooks",
        path: "src/hooks",
        children: [
          { kind: "file", name: "use-auth.ts", path: "src/hooks/use-auth.ts" },
          { kind: "file", name: "use-theme.ts", path: "src/hooks/use-theme.ts" },
        ],
      },
      {
        kind: "folder",
        name: "lib",
        path: "src/lib",
        children: [
          { kind: "file", name: "fetch.ts", path: "src/lib/fetch.ts" },
        ],
      },
      { kind: "file", name: "app.tsx", path: "src/app.tsx" },
      { kind: "file", name: "main.tsx", path: "src/main.tsx" },
    ],
  },
  { kind: "file", name: "package.json", path: "package.json" },
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

export default function Guides() {
  return (
    <div className="max-w-sm mx-auto">
      <FileTree
        guides
        defaultExpanded={["src", "src/components", "src/hooks"]}
      >
        {tree.map(renderNode)}
      </FileTree>
    </div>
  );
}
