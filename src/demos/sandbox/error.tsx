import ShikiHighlighter from "#/lib/shiki";
import { Chip } from "#/components/ai/chip";
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
  SandboxContent,
  SandboxHeader,
  SandboxPanel,
  SandboxTab,
  SandboxTabs,
  SandboxTabsList,
  SandboxTitle,
  SandboxTrigger,
} from "#/components/ai/sandbox";

const code = `def average(values):
    return sum(values) / len(values)

# scores never populated
scores = []
print(f"average: {average(scores):.2f}")`;

export default function ErrorDemo() {
  return (
    <div className="mx-auto max-w-2xl">
      <Sandbox state="error" defaultOpen>
        <SandboxHeader>
          <SandboxTrigger>
            <SandboxTitle>average.py</SandboxTitle>
            <Chip size="sm" className="text-destructive">
              error
            </Chip>
          </SandboxTrigger>
        </SandboxHeader>
        <SandboxContent>
          <SandboxTabs defaultValue="output">
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
              <Exception defaultOpen>
                <ExceptionHeader>
                  <ExceptionType>ZeroDivisionError</ExceptionType>
                  <ExceptionMessage>division by zero</ExceptionMessage>
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
                        average.py:6:9
                      </ExceptionFrameLocation>
                    </ExceptionFrame>
                  </ExceptionFrames>
                </ExceptionContent>
              </Exception>
            </SandboxPanel>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    </div>
  );
}
