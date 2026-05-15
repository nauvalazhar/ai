import { useState } from "react";
import { Button } from "#/components/ai/button";
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuTrigger,
} from "#/components/ai/menu";

export default function Radio() {
  const [model, setModel] = useState("medium");

  return (
    <div className="mx-auto max-w-2xl flex items-center justify-center py-10">
      <Menu>
        <MenuTrigger
          render={<Button variant="secondary">Intelligence</Button>}
        />
        <MenuPopup>
          <MenuGroup>
            <MenuGroupLabel>Intelligence</MenuGroupLabel>
            <MenuRadioGroup value={model} onValueChange={setModel}>
              <MenuRadioItem value="low">Low</MenuRadioItem>
              <MenuRadioItem value="medium">Medium</MenuRadioItem>
              <MenuRadioItem value="high">High</MenuRadioItem>
              <MenuRadioItem value="extra-high">Extra High</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        </MenuPopup>
      </Menu>
    </div>
  );
}
