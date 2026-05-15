import { CopyIcon, ScissorsIcon, ShareIcon, TrashIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "#/components/ai/menu";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl flex items-center justify-center py-10">
      <Menu>
        <MenuTrigger render={<Button variant="secondary">Open menu</Button>} />
        <MenuPopup>
          <MenuItem>
            <CopyIcon />
            Copy
          </MenuItem>
          <MenuItem>
            <ScissorsIcon />
            Cut
          </MenuItem>
          <MenuItem>
            <ShareIcon />
            Share
          </MenuItem>
          <MenuSeparator />
          <MenuItem className="text-destructive">
            <TrashIcon className="text-destructive" />
            Delete
          </MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  );
}
