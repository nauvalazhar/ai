import { useEffect, useState } from "react";
import {
  Diff,
  DiffContent,
  DiffFile,
  DiffFileHeader,
  DiffFileName,
  DiffFilePanel,
  DiffHeader,
  DiffLine,
  DiffStat,
  DiffTitle,
} from "#/components/ai/diff";

type Line = {
  state: "added" | "removed" | "unchanged";
  number: number;
  text: string;
};

const script: Line[] = [
  { state: "unchanged", number: 1, text: "import { useState } from \"react\";" },
  { state: "unchanged", number: 2, text: "" },
  { state: "removed", number: 3, text: "export function Counter() {" },
  { state: "added", number: 3, text: "export function Counter({ start = 0 }) {" },
  { state: "removed", number: 4, text: "  const [count, setCount] = useState(0);" },
  { state: "added", number: 4, text: "  const [count, setCount] = useState(start);" },
  { state: "unchanged", number: 5, text: "  return (" },
  { state: "unchanged", number: 6, text: "    <button onClick={() => setCount((n) => n + 1)}>" },
  { state: "unchanged", number: 7, text: "      Clicked {count} times" },
  { state: "unchanged", number: 8, text: "    </button>" },
  { state: "unchanged", number: 9, text: "  );" },
  { state: "unchanged", number: 10, text: "}" },
];

export default function Streaming() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= script.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), 220);
    return () => clearTimeout(id);
  }, [count]);

  const additions = script.slice(0, count).filter((l) => l.state === "added").length;
  const removals = script.slice(0, count).filter((l) => l.state === "removed").length;

  return (
    <div className="mx-auto max-w-2xl">
      <Diff>
        <DiffHeader>
          <DiffTitle>1 file changed</DiffTitle>
        </DiffHeader>
        <DiffContent>
          <DiffFile>
            <DiffFileHeader>
              <DiffFileName>counter.tsx</DiffFileName>
              <DiffStat kind="added">+{additions}</DiffStat>
              <DiffStat kind="removed">-{removals}</DiffStat>
            </DiffFileHeader>
            <DiffFilePanel>
              {script.slice(0, count).map((line, i) => (
                <DiffLine key={i} state={line.state} number={line.number}>
                  {line.text}
                </DiffLine>
              ))}
            </DiffFilePanel>
          </DiffFile>
        </DiffContent>
      </Diff>
    </div>
  );
}
