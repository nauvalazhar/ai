import ShikiHighlighter from "#/lib/shiki";
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
import { Status } from "#/components/ai/status";

const code = `def average(values):
    return sum(values) / len(values)

scores = [82, 91, 77, 88, 95]
print(f"average: {average(scores):.2f}")`;

const output = `average: 86.60`;

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl">
      <Sandbox state="success" defaultOpen>
        <SandboxHeader>
          <SandboxTrigger>
            <SandboxTitle>average.py</SandboxTitle>
            <Status state="active" size="sm">success</Status>
          </SandboxTrigger>
        </SandboxHeader>
        <SandboxContent>
          <SandboxTabs defaultValue="input">
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
              <pre className="text-sm font-mono text-foreground">{output}</pre>
            </SandboxPanel>
          </SandboxTabs>
        </SandboxContent>
      </Sandbox>
    </div>
  );
}
