import { Check, CogIcon, Copy } from "lucide-react";
import { useState } from "react";
import {
  Env,
  EnvHeader,
  EnvList,
  EnvTitle,
  EnvVar,
  EnvVarCopy,
  EnvVarName,
  EnvVarValue,
} from "#/components/ai/env";
import { Switch } from "#/components/ai/switch";

const vars = [
  { name: "VERCEL_TOKEN", value: "vc_live_2c4f8a1b9d7e3f5a", secret: true },
  { name: "GITHUB_TOKEN", value: "ghp_abc123def456ghi789jkl012", secret: true },
  { name: "REGION", value: "us-east-1", secret: false },
];

export default function Controlled() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-3">
      <Env visible={visible} onVisibleChange={setVisible}>
        <EnvHeader>
          <CogIcon className="size-4" />
          <EnvTitle>Secrets</EnvTitle>
          <label className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            Show values
            <Switch checked={visible} onCheckedChange={setVisible} size="sm" />
          </label>
        </EnvHeader>
        <EnvList>
          {vars.map((v) => (
            <EnvVar key={v.name} value={v.value} secret={v.secret}>
              <EnvVarName>{v.name}</EnvVarName>
              <EnvVarValue />
              <EnvVarCopy
                aria-label={`Copy ${v.name}`}
                className="group/env-var-copy inline-flex size-7 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&_svg]:size-3.5"
              >
                <Copy className="group-data-copied/env-var-copy:hidden" />
                <Check className="hidden group-data-copied/env-var-copy:block" />
              </EnvVarCopy>
            </EnvVar>
          ))}
        </EnvList>
      </Env>
      <p className="text-xs text-muted-foreground text-center">
        External state: {visible ? "visible" : "hidden"}
      </p>
    </div>
  );
}
