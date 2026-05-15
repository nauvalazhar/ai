import {
  LogOutIcon,
  Settings2Icon,
  StarIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "#/components/ai/menu";

export default function Group() {
  return (
    <div className="mx-auto max-w-2xl flex items-center justify-center py-10">
      <Menu>
        <MenuTrigger render={<Button variant="secondary">Account</Button>} />
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Account</MenuGroupLabel>
            <MenuItem>
              <UserIcon />
              Profile
            </MenuItem>
            <MenuItem>
              <Settings2Icon />
              Settings
            </MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Workspace</MenuGroupLabel>
            <MenuItem>
              <UsersIcon />
              Members
            </MenuItem>
            <MenuItem>
              <StarIcon />
              Upgrade plan
            </MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem>
            <LogOutIcon />
            Sign out
          </MenuItem>
        </MenuPopup>
      </Menu>
    </div>
  );
}
