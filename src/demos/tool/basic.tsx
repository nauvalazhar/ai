import { CloudIcon } from "lucide-react";
import {
  Tool,
  ToolBlock,
  ToolContent,
  ToolIcon,
  ToolLabel,
  ToolName,
  ToolSubtitle,
  ToolTrigger,
} from "#/components/ai/tool";

const input = `{
  "city": "San Francisco",
  "units": "metric"
}`;

const output = `{
  "temperature": 14,
  "conditions": "Foggy",
  "humidity": 0.82
}`;

export default function Basic() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <Tool state="success" defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <CloudIcon />
          </ToolIcon>
          <ToolName>get_weather</ToolName>
          <ToolLabel>San Francisco</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{input}</ToolBlock>
          <ToolSubtitle>Output</ToolSubtitle>
          <ToolBlock>{output}</ToolBlock>
        </ToolContent>
      </Tool>
    </div>
  );
}
