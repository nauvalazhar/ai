import {
  Diff,
  DiffContent,
  DiffFile,
  DiffFileHeader,
  DiffFileName,
  DiffFilePanel,
  DiffHeader,
  DiffRow,
  DiffStat,
  DiffTitle,
  useDiff,
} from "#/components/ai/diff";

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

function FileBlock({
  name,
  from,
  to,
  defaultOpen,
}: {
  name: string;
  from: string;
  to: string;
  defaultOpen?: boolean;
}) {
  const { lines, additions, removals } = useDiff({ from, to });
  return (
    <DiffFile defaultOpen={defaultOpen}>
      <DiffFileHeader>
        <DiffFileName>{name}</DiffFileName>
        <DiffStat kind="added">+{additions}</DiffStat>
        <DiffStat kind="removed">-{removals}</DiffStat>
      </DiffFileHeader>
      <DiffFilePanel>
        {lines.map((entry) => (
          <DiffRow key={entry.key} entry={entry} />
        ))}
      </DiffFilePanel>
    </DiffFile>
  );
}

export default function MultiFile() {
  return (
    <div className="mx-auto max-w-2xl">
      <Diff>
        <DiffHeader>
          <DiffTitle>3 files changed</DiffTitle>
        </DiffHeader>
        <DiffContent>
          <FileBlock name="style.css" from={styleBefore} to={styleAfter} />
          <FileBlock name="app.tsx" from={appBefore} to={appAfter} />
          <FileBlock
            name="README.md"
            from={readmeBefore}
            to={readmeAfter}
            defaultOpen={false}
          />
        </DiffContent>
      </Diff>
    </div>
  );
}
