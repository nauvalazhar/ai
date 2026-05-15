import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ai/select";

export default function Disabled() {
  return (
    <div className="mx-auto w-64 py-10 flex flex-col gap-4">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick a model" />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            <SelectItem value="opus">Claude Opus 4.7</SelectItem>
            <SelectItem value="sonnet">Claude Sonnet 4.6</SelectItem>
            <SelectItem value="haiku" disabled>
              Claude Haiku 4.5 (rate limited)
            </SelectItem>
            <SelectItem value="legacy" disabled>
              Claude 3.5 Sonnet (deprecated)
            </SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>

      <Select disabled defaultValue="sonnet">
        <SelectTrigger>
          <SelectValue placeholder="Pick a model" />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            <SelectItem value="opus">Claude Opus 4.7</SelectItem>
            <SelectItem value="sonnet">Claude Sonnet 4.6</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    </div>
  );
}
