import { useEffect, useRef, useState } from "react";
import { FilePenIcon } from "lucide-react";
import {
  Tool,
  ToolArgument,
  ToolContent,
  ToolIcon,
  ToolLabel,
  ToolName,
  ToolSubtitle,
  ToolTrigger,
} from "#/components/ai/tool";

const fullSource = `{
  "path": "src/components/ai/markdown.tsx",
  "find": "ReactMarkdown remarkPlugins={[remarkGfm]}",
  "replace": "ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]}",
  "create_backup": true
}`;

export default function StreamingArguments() {
  const [content, setContent] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = indexRef.current + 2;
      if (next >= fullSource.length) {
        indexRef.current = 0;
        setContent(fullSource);
        setDone(true);
        window.setTimeout(() => {
          setContent("");
          setDone(false);
        }, 1800);
        return;
      }
      indexRef.current = next;
      setContent(fullSource.slice(0, next));
    }, 35);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-xl p-6">
      <Tool state={done ? "running" : "pending"} defaultOpen>
        <ToolTrigger>
          <ToolIcon>
            <FilePenIcon />
          </ToolIcon>
          <ToolName>edit_file</ToolName>
          <ToolLabel>
            {done ? "applying" : "receiving arguments"}
          </ToolLabel>
        </ToolTrigger>
        <ToolContent>
          <ToolSubtitle>Input</ToolSubtitle>
          <ToolArgument
            value={content}
            state={done ? "complete" : "streaming"}
          />
        </ToolContent>
      </Tool>
    </div>
  );
}
