import { Check, CogIcon, Copy, Eye, EyeOff } from "lucide-react";
import {
  Env,
  EnvHeader,
  EnvList,
  EnvTitle,
  EnvVar,
  EnvVarCopy,
  EnvVarName,
  EnvVarValue,
  useEnv,
} from "#/components/ai/env";
import { Button } from "#/components/ai/button";

const vars = [
  { name: "NODE_ENV", value: "production", secret: false },
  { name: "OPENAI_API_KEY", value: "sk-proj-abc123def456ghi789", secret: true },
  {
    name: "STRIPE_SECRET_KEY",
    value: "sk_live_51HxYZaBcDeFgHiJk",
    secret: true,
  },
  {
    name: "REDIS_URL",
    value: "redis://default:secret@cache.local:6379",
    secret: true,
  },
];

function RevealAll() {
  const { visible, setVisible } = useEnv();
  return (
    <Button
      type="button"
      onClick={() => setVisible(!visible)}
      className="ml-auto"
      variant="outline"
    >
      {visible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      {visible ? "Hide" : "Reveal"}
    </Button>
  );
}

export default function Toggle() {
  return (
    <div className="max-w-2xl mx-auto">
      <Env>
        <EnvHeader>
          <CogIcon className="size-4" />
          <EnvTitle>.env.production</EnvTitle>
          <RevealAll />
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
