import { FileIcon, FileTextIcon, FolderIcon } from "lucide-react";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
  FileTreeFolderPanel,
  FileTreeRow,
  FileTreeIcon,
  FileTreeLabel,
} from "#/components/ai/file-tree";

export default function Basic() {
  return (
    <div className="max-w-sm mx-auto">
      <FileTree defaultExpanded={["src", "src/components"]}>
        <FileTreeFolder value="src">
          <FileTreeRow>
            <FileTreeIcon>
              <FolderIcon />
            </FileTreeIcon>
            <FileTreeLabel>src</FileTreeLabel>
          </FileTreeRow>
          <FileTreeFolderPanel>
            <FileTreeFolder value="src/components">
              <FileTreeRow>
                <FileTreeIcon>
                  <FolderIcon />
                </FileTreeIcon>
                <FileTreeLabel>components</FileTreeLabel>
              </FileTreeRow>
              <FileTreeFolderPanel>
                <FileTreeFile value="src/components/button.tsx">
                  <FileTreeRow>
                    <FileTreeIcon>
                      <FileTextIcon />
                    </FileTreeIcon>
                    <FileTreeLabel>button.tsx</FileTreeLabel>
                  </FileTreeRow>
                </FileTreeFile>
                <FileTreeFile value="src/components/input.tsx">
                  <FileTreeRow>
                    <FileTreeIcon>
                      <FileTextIcon />
                    </FileTreeIcon>
                    <FileTreeLabel>input.tsx</FileTreeLabel>
                  </FileTreeRow>
                </FileTreeFile>
              </FileTreeFolderPanel>
            </FileTreeFolder>
            <FileTreeFile value="src/index.ts">
              <FileTreeRow>
                <FileTreeIcon>
                  <FileTextIcon />
                </FileTreeIcon>
                <FileTreeLabel>index.ts</FileTreeLabel>
              </FileTreeRow>
            </FileTreeFile>
          </FileTreeFolderPanel>
        </FileTreeFolder>
        <FileTreeFile value="package.json">
          <FileTreeRow>
            <FileTreeIcon>
              <FileIcon />
            </FileTreeIcon>
            <FileTreeLabel>package.json</FileTreeLabel>
          </FileTreeRow>
        </FileTreeFile>
        <FileTreeFile value="README.md">
          <FileTreeRow>
            <FileTreeIcon>
              <FileTextIcon />
            </FileTreeIcon>
            <FileTreeLabel>README.md</FileTreeLabel>
          </FileTreeRow>
        </FileTreeFile>
      </FileTree>
    </div>
  );
}
