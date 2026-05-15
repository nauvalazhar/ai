import { Button } from "#/components/ai/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "#/components/ai/tooltip";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl flex flex-wrap items-center justify-center gap-3 py-10">
      <Tooltip>
        <TooltipTrigger
          render={<Button variant="secondary">Hover me</Button>}
        />
        <TooltipPopup>Tooltip on top</TooltipPopup>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={<Button variant="secondary">Bottom</Button>}
        />
        <TooltipPopup side="bottom">Tooltip on bottom</TooltipPopup>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<Button variant="secondary">Right</Button>} />
        <TooltipPopup side="right">Tooltip on the right</TooltipPopup>
      </Tooltip>
    </div>
  );
}
