import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ai/select";

export default function Basic() {
  return (
    <div className="mx-auto w-64 py-10">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick a model" />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            <SelectItem value="opus">Claude Opus 4.7</SelectItem>
            <SelectItem value="sonnet">Claude Sonnet 4.6</SelectItem>
            <SelectItem value="haiku">Claude Haiku 4.5</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    </div>
  );
}
