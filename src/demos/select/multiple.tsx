import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ai/select";

export default function Multiple() {
  return (
    <div className="mx-auto w-64 py-10">
      <Select multiple>
        <SelectTrigger>
          <SelectValue placeholder="Pick tags" />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature">Feature</SelectItem>
            <SelectItem value="docs">Docs</SelectItem>
            <SelectItem value="perf">Performance</SelectItem>
            <SelectItem value="refactor">Refactor</SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    </div>
  );
}
