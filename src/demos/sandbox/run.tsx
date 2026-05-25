import { LoaderIcon, PlayIcon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import ShikiHighlighter from "#/lib/shiki";
import { Button } from "#/components/ai/button";
import {
  Exception,
  ExceptionContent,
  ExceptionFrame,
  ExceptionFrameFunction,
  ExceptionFrameLocation,
  ExceptionFrames,
  ExceptionHeader,
  ExceptionMessage,
  ExceptionType,
} from "#/components/ai/exception";
import {
  Sandbox,
  SandboxAction,
  SandboxContent,
  SandboxHeader,
  SandboxPanel,
  SandboxTab,
  SandboxTabs,
  SandboxTabsList,
  SandboxTitle,
  SandboxTrigger,
} from "#/components/ai/sandbox";
import { Status } from "#/components/ai/status";

type Status = "idle" | "running" | "success" | "error";

const code = `def average(values):
    return sum(values) / len(values)

scores = [82, 91, 77, 88, 95]
print(f"average: {average(scores):.2f}")`;

const result = `average: 86.60`;

export default function Run() {
  const [status, setStatus] = useState<Status>("idle");
  const [runs, setRuns] = useState(0);
  const [tab, setTab] = useState("input");

  function handleRun() {
    setStatus("running");
    setTab("output");
    setTimeout(() => {
      setStatus(runs % 2 === 0 ? "success" : "error");
      setRuns((n) => n + 1);
    }, 1400);
  }

  const running = status === "running";

  return (
    <div className="mx-auto max-w-2xl">
      <Sandbox state={status === "idle" ? undefined : status} defaultOpen>
        <SandboxHeader>
          <SandboxTrigger>
            <SandboxTitle>average.py</SandboxTitle>
            {status === "idle" && (
              <Status state="neutral" size="sm">idle</Status>
            )}
            {status === "running" && (
              <Status state="inflight" size="sm" pulse>running</Status>
            )}
            {status === "success" && (
              <Status state="active" size="sm">success</Status>
            )}
            {status === "error" && (
              <Status state="error" size="sm">error</Status>
            )}
          </SandboxTrigger>
          <SandboxAction>
            <Button
              variant="ghost"
              iconOnly
              disabled={running}
              aria-label={status === "idle" ? "Run" : "Re-run"}
              onClick={handleRun}
            >
              {running ? (
                <LoaderIcon className="animate-spin" />
              ) : status === "idle" ? (
                <PlayIcon />
              ) : (
                <RotateCcwIcon />
              )}
            </Button>
          </SandboxAction>
        </SandboxHeader>
        <SandboxContent>
          <SandboxTabs value={tab} onValueChange={(v) => setTab(String(v))}>
            <SandboxTabsList>
              <SandboxTab value="input">Input</SandboxTab>
              <SandboxTab value="output">Output</SandboxTab>
            </SandboxTabsList>
            <SandboxPanel value="input">
              <ShikiHighlighter
                language="python"
                theme={{ light: "github-light", dark: "github-dark" }}
                defaultColor="light"
                addDefaultStyles={false}
                showLanguage={false}
                className="text-sm font-mono [&_pre]:bg-transparent! [&_pre]:outline-none!"
              >
                {code}
              </ShikiHighlighter>
            </SandboxPanel>
            <SandboxPanel value="output">
              {status === "idle" && (
                <p className="text-sm text-muted-foreground">
                  Click run to execute.
                </p>
              )}
              {status === "running" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderIcon className="size-3.5 animate-spin" />
                  Executing...
                </div>
              )}
              {status === "success" && (
                <pre className="text-sm font-mono text-foreground">{result}</pre>
              )}
              {status === "error" && (
                <Exception defaultOpen>
                  <ExceptionHeader>
                    <ExceptionType>RuntimeError</ExceptionType>
                    <ExceptionMessage>
                      Simulated execution failure
                    </ExceptionMessage>
                  </ExceptionHeader>
                  <ExceptionContent>
                    <ExceptionFrames>
                      <ExceptionFrame active>
                        <ExceptionFrameFunction>average</ExceptionFrameFunction>
                        <ExceptionFrameLocation>
                          average.py:2:12
                        </ExceptionFrameLocation>
                      </ExceptionFrame>
                      <ExceptionFrame>
                        <ExceptionFrameFunction>
                          &lt;module&gt;
                        </ExceptionFrameFunction>
                        <ExceptionFrameLocation>
                          average.py:5:9
                        </ExceptionFrameLocation>
                      </ExceptionFrame>
                    </ExceptionFrames>
                  </ExceptionContent>
                </Exception>
              )}
            </SandboxPanel>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    </div>
  );
}
