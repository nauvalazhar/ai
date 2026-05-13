import { DatabaseIcon } from "lucide-react";
import {
  Tool,
  ToolBlock,
  ToolContent,
  ToolError,
  ToolIcon,
  ToolLabel,
  ToolName,
  ToolSubtitle,
  ToolTrigger,
} from "#/components/ai/tool";

const input = `{
  "query": "SELECT * FROM users WHERE id = 42"
}`;

const output = `{
  "rows": [{ "id": 42, "name": "Ada" }]
}`;

export default function States() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3 p-6">
      <Tool state="running" defaultOpen={false}>
        <ToolTrigger>
          <ToolIcon>
            <DatabaseIcon />
          </ToolIcon>
          <ToolName>run_query</ToolName>
          <ToolLabel>running</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{input}</ToolBlock>
        </ToolContent>
      </Tool>

      <Tool state="success" defaultOpen={false}>
        <ToolTrigger>
          <ToolIcon>
            <DatabaseIcon />
          </ToolIcon>
          <ToolName>run_query</ToolName>
          <ToolLabel>1 row returned</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{input}</ToolBlock>
          <ToolSubtitle>Output</ToolSubtitle>
          <ToolBlock>{output}</ToolBlock>
        </ToolContent>
      </Tool>

      <Tool state="error" defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <DatabaseIcon />
          </ToolIcon>
          <ToolName>run_query</ToolName>
          <ToolLabel>connection refused</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{input}</ToolBlock>
          <ToolError>
            Connection refused: could not reach database at db.internal:5432
          </ToolError>
        </ToolContent>
      </Tool>
    </div>
  );
}
