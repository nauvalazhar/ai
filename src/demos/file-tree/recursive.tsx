import { FileTextIcon, FolderIcon } from "lucide-react";
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
    name: "app",
    path: "app",
    children: [
      {
        kind: "folder",
        name: "routes",
        path: "app/routes",
        children: [
          { kind: "file", name: "index.tsx", path: "app/routes/index.tsx" },
          { kind: "file", name: "about.tsx", path: "app/routes/about.tsx" },
          {
            kind: "folder",
            name: "docs",
            path: "app/routes/docs",
            children: [
              {
                kind: "file",
                name: "_layout.tsx",
                path: "app/routes/docs/_layout.tsx",
              },
              {
                kind: "file",
                name: "$slug.tsx",
                path: "app/routes/docs/$slug.tsx",
              },
            ],
          },
        ],
      },
      { kind: "file", name: "root.tsx", path: "app/root.tsx" },
      { kind: "file", name: "client.tsx", path: "app/client.tsx" },
    ],
  },
  {
    kind: "folder",
    name: "public",
    path: "public",
    children: [
      { kind: "file", name: "favicon.ico", path: "public/favicon.ico" },
      { kind: "file", name: "robots.txt", path: "public/robots.txt" },
    ],
  },
  { kind: "file", name: "vite.config.ts", path: "vite.config.ts" },
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

export default function Recursive() {
  return (
    <div className="max-w-sm mx-auto">
      <FileTree defaultExpanded={["app", "app/routes"]}>
        {tree.map(renderNode)}
      </FileTree>
    </div>
  );
}
