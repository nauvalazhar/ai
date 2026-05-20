import { ArrowRightIcon } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "#/components/ai/popover";

export default function Basic() {
  return (
    <div className="mx-auto flex w-full max-w-sm items-center justify-center py-8">
      <Popover>
        <PopoverTrigger render={<Button>Upgrade</Button>} />
        <PopoverPopup className="w-72">
          <PopoverTitle>Upgrade to Pro</PopoverTitle>
          <PopoverDescription>
            Upgrade to Pro to get more features and access to exclusive content.
          </PopoverDescription>
          <Button variant="secondary">
            Upgrade
            <ArrowRightIcon />
          </Button>
        </PopoverPopup>
      </Popover>
    </div>
  );
}
