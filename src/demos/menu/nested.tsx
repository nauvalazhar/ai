import {
  DownloadIcon,
  FileTextIcon,
  ImageIcon,
  PaletteIcon,
  ShareIcon,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuPopup,
  MenuSubmenuTrigger,
  MenuTrigger,
} from "#/components/ai/menu";

export default function Nested() {
  return (
    <div className="mx-auto max-w-2xl flex items-center justify-center py-10">
      <Menu>
        <MenuTrigger render={<Button variant="secondary">File</Button>} />
        <MenuPopup>
          <MenuItem>
            <ShareIcon />
            Share
          </MenuItem>
          <MenuSubmenu>
            <MenuSubmenuTrigger>
              <DownloadIcon />
              Export as
            </MenuSubmenuTrigger>
            <MenuSubmenuPopup>
              <MenuItem>
                <FileTextIcon />
                PDF
              </MenuItem>
              <MenuItem>
                <ImageIcon />
                PNG
              </MenuItem>
              <MenuItem>
                <FileTextIcon />
                Markdown
              </MenuItem>
            </MenuSubmenuPopup>
          </MenuSubmenu>
          <MenuSeparator />
          <MenuSubmenu>
            <MenuSubmenuTrigger>
              <PaletteIcon />
              Theme
            </MenuSubmenuTrigger>
            <MenuSubmenuPopup>
              <MenuItem>Light</MenuItem>
              <MenuItem>Dark</MenuItem>
              <MenuItem>System</MenuItem>
            </MenuSubmenuPopup>
          </MenuSubmenu>
        </MenuPopup>
      </Menu>
    </div>
  );
}
