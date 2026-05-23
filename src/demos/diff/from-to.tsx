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

const before = `function greet(name) {
  console.log("Hello, " + name);
  return name.toUpperCase();
}

greet("world");`;

const after = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return name.toLowerCase();
}

greet("world");`;

export default function FromTo() {
  const { lines, additions, removals } = useDiff({ from: before, to: after });

  return (
    <div className="mx-auto max-w-2xl">
      <Diff>
        <DiffHeader>
          <DiffTitle>1 file changed</DiffTitle>
        </DiffHeader>
        <DiffContent>
          <DiffFile>
            <DiffFileHeader>
              <DiffFileName>greet.js</DiffFileName>
              <DiffStat kind="added">+{additions}</DiffStat>
              <DiffStat kind="removed">-{removals}</DiffStat>
            </DiffFileHeader>
            <DiffFilePanel>
              {lines.map((entry) => (
                <DiffRow key={entry.key} entry={entry} />
              ))}
            </DiffFilePanel>
          </DiffFile>
        </DiffContent>
      </Diff>
    </div>
  );
}
