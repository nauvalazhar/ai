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

const before = `const config = {
  endpoint: "https://api.example.com/v1",
  timeout: 5000,
  retries: 3,
  headers: { "x-api-key": "sk-old-key" },
};`;

const after = `const config = {
  endpoint: "https://api.example.com/v2",
  timeout: 8000,
  retries: 5,
  headers: { "x-api-key": "sk-new-key", "x-trace": "true" },
};`;

export default function WordLevel() {
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
              <DiffFileName>config.ts</DiffFileName>
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
