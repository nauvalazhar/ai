import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "#/components/ai/select";

export default function Group() {
  return (
    <div className="mx-auto w-64 py-10">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick a model" />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            <SelectGroup>
              <SelectGroupLabel>Cloud</SelectGroupLabel>
              <SelectItem value="opus">Claude Opus 4.7</SelectItem>
              <SelectItem value="sonnet">Claude Sonnet 4.6</SelectItem>
              <SelectItem value="haiku">Claude Haiku 4.5</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectGroupLabel>Local</SelectGroupLabel>
              <SelectItem value="llama">Llama 3.1</SelectItem>
              <SelectItem value="mistral">Mistral Nemo</SelectItem>
            </SelectGroup>
          </SelectList>
        </SelectPopup>
      </Select>
    </div>
  );
}
