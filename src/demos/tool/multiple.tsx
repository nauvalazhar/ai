import { GlobeIcon, SearchIcon, SparklesIcon } from "lucide-react";
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

export default function Multiple() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-2 p-6">
      <Tool state="success">
        <ToolTrigger>
          <ToolIcon>
            <SearchIcon />
          </ToolIcon>
          <ToolName>search_docs</ToolName>
          <ToolLabel>4 hits</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Query</ToolSubtitle>
          <ToolBlock>{`tool calling streaming with abort`}</ToolBlock>
        </ToolContent>
      </Tool>

      <Tool state="success">
        <ToolTrigger>
          <ToolIcon>
            <GlobeIcon />
          </ToolIcon>
          <ToolName>fetch_page</ToolName>
          <ToolLabel>docs.example.com/tools</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Output</ToolSubtitle>
          <ToolBlock>{`Title: Tool calls\nWords: 1,284\nFetched in 412ms`}</ToolBlock>
        </ToolContent>
      </Tool>

      <Tool state="error">
        <ToolTrigger>
          <ToolIcon>
            <GlobeIcon />
          </ToolIcon>
          <ToolName>fetch_page</ToolName>
          <ToolLabel>blog.example.com</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolError>404 Not Found</ToolError>
        </ToolContent>
      </Tool>

      <Tool state="running">
        <ToolTrigger>
          <ToolIcon>
            <SparklesIcon />
          </ToolIcon>
          <ToolName>summarize</ToolName>
          <ToolLabel>working</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolBlock>{`3 sources, 4,210 words`}</ToolBlock>
        </ToolContent>
      </Tool>
    </div>
  );
}
