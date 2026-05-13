import { DatabaseIcon } from "lucide-react";
import ShikiHighlighter from "react-shiki/web";
import {
  Tool,
  ToolContent,
  ToolIcon,
  ToolLabel,
  ToolName,
  ToolSubtitle,
  ToolTrigger,
} from "#/components/ai/tool";

const input = `{
  "query": "SELECT id, name, email FROM users WHERE active = true ORDER BY created_at DESC LIMIT 3",
  "params": {}
}`;

const output = `[
  { "id": 42, "name": "Ada Lovelace", "email": "ada@example.com" },
  { "id": 41, "name": "Grace Hopper", "email": "grace@example.com" },
  { "id": 40, "name": "Alan Turing", "email": "alan@example.com" }
]`;

export default function Syntax() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <Tool state="success" defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <DatabaseIcon />
          </ToolIcon>
          <ToolName>run_query</ToolName>
          <ToolLabel>3 rows</ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ShikiHighlighter
            language="json"
            theme={{ light: "github-light", dark: "github-dark" }}
            defaultColor="light"
            addDefaultStyles={false}
            showLanguage={false}
            className="max-h-64 overflow-auto rounded ring ring-border bg-surface-elevated text-sm font-mono [&_pre]:bg-transparent! [&_pre]:outline-none! [&_pre]:p-3"
          >
            {input}
          </ShikiHighlighter>

          <ToolSubtitle>Output</ToolSubtitle>
          <ShikiHighlighter
            language="json"
            theme={{ light: "github-light", dark: "github-dark" }}
            defaultColor="light"
            addDefaultStyles={false}
            showLanguage={false}
            className="max-h-64 overflow-auto rounded ring ring-border bg-surface-elevated text-sm font-mono [&_pre]:bg-transparent! [&_pre]:outline-none! [&_pre]:p-3"
          >
            {output}
          </ShikiHighlighter>
        </ToolContent>
      </Tool>
    </div>
  );
}
