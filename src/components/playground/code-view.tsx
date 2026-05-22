import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Syntax } from "./syntax";
import { Button } from "../ai/button";

export function CodeView({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="relative h-full px-4">
      <Button
        type="button"
        onClick={handleCopy}
        variant="outline"
        className="absolute z-10 top-3 right-3 text-xs text-muted-foreground hover:text-foreground"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        Copy
      </Button>
      <div className="h-full overflow-auto pt-14">
        <Syntax showLineNumbers language={language}>
          {code}
        </Syntax>
      </div>
    </div>
  );
}
