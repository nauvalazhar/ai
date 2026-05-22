import { Check, CogIcon, Copy } from "lucide-react";
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

const vars = [
  { name: "NODE_ENV", value: "production", secret: false },
  { name: "PORT", value: "3300", secret: false },
  { name: "API_KEY", value: "sk-proj-9f3a8c2b1e7d4a6f", secret: true },
  {
    name: "DATABASE_URL",
    value: "postgres://user:pass@db.local:5432/app",
    secret: true,
  },
];

export default function Basic() {
  return (
    <div className="max-w-2xl mx-auto">
      <Env>
        <EnvHeader>
          <CogIcon className="size-4" />
          <EnvTitle>Environment Variables</EnvTitle>
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
    </div>
  );
}
