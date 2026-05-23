import {
  Diff,
  DiffContent,
  DiffHeader,
  DiffTitle,
} from "#/components/ai/diff";
import { DiffRichFile } from "#/components/ai/diff-rich";

const styleBefore = `:root {
  --bg: #111827;
  --panel: #1f2937;
}`;

const styleAfter = `:root {
  --bg: #020617;
  --panel: #1f2937;
  --accent: #38bdf8;
}`;

const appBefore = `export function App() {
  return <div className="app">hello</div>;
}`;

const appAfter = `export function App() {
  return (
    <div className="app">
      <header>welcome</header>
      <main>hello</main>
    </div>
  );
}`;

const readmeBefore = `# project

todo`;

const readmeAfter = `# project

A small playground for trying out the diff component.

## getting started

bun install
bun dev`;

export default function MultiFile() {
  return (
    <div className="mx-auto max-w-2xl">
      <Diff>
        <DiffHeader>
          <DiffTitle>3 files changed</DiffTitle>
        </DiffHeader>
        <DiffContent>
          <DiffRichFile
            filename="style.css"
            from={styleBefore}
            to={styleAfter}
          />
          <DiffRichFile filename="app.tsx" from={appBefore} to={appAfter} />
          <DiffRichFile
            filename="README.md"
            from={readmeBefore}
            to={readmeAfter}
            defaultOpen={false}
          />
        </DiffContent>
      </Diff>
    </div>
  );
}
