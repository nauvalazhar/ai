import { GlobeIcon } from "lucide-react";
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
  "url": "https://api.example.com/v2/orders/9001",
  "method": "GET"
}`;

export default function ErrorDemo() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <Tool state="error" defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <GlobeIcon />
          </ToolIcon>
          <ToolName>http_request</ToolName>
          <ToolLabel>timed out after 30s</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{input}</ToolBlock>
          <ToolError>
            <p className="font-medium">Network timeout</p>
            <p className="mt-1 text-destructive/80">
              The upstream service did not respond within the configured 30s
              window. Try again, or fall back to the cached order summary.
            </p>
          </ToolError>
        </ToolContent>
      </Tool>
    </div>
  );
}
