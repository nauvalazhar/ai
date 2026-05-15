import { useState } from "react";
import { Button } from "#/components/ai/button";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuTrigger,
} from "#/components/ai/menu";

export default function Checkbox() {
  const [lineNumbers, setLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);
  const [minimap, setMinimap] = useState(true);

  return (
    <div className="mx-auto max-w-2xl flex items-center justify-center py-10">
      <Menu>
        <MenuTrigger render={<Button variant="secondary">View</Button>} />
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Editor</MenuGroupLabel>
            <MenuCheckboxItem
              checked={lineNumbers}
              onCheckedChange={setLineNumbers}
            >
              Show line numbers
            </MenuCheckboxItem>
            <MenuCheckboxItem checked={wordWrap} onCheckedChange={setWordWrap}>
              Word wrap
            </MenuCheckboxItem>
            <MenuCheckboxItem checked={minimap} onCheckedChange={setMinimap}>
              Minimap
            </MenuCheckboxItem>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    </div>
  );
}
