import { Button } from "#/components/ai/button";
import {
  Diff,
  DiffAction,
  DiffContent,
  DiffFile,
  DiffFileHeader,
  DiffFileName,
  DiffFilePanel,
  DiffHeader,
  DiffLine,
  DiffSkip,
  DiffStat,
  DiffTitle,
  DiffWord,
} from "#/components/ai/diff";
import { ArrowUpRightIcon, UndoIcon } from "lucide-react";

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl">
      <Diff>
        <DiffHeader>
          <DiffTitle>1 file changed</DiffTitle>
          <DiffAction>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Undo
              <UndoIcon />
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
            >
              Review
              <ArrowUpRightIcon />
            </Button>
          </DiffAction>
        </DiffHeader>

        <DiffContent>
          <DiffFile>
            <DiffFileHeader>
              <DiffFileName>style.css</DiffFileName>
              <DiffStat kind="added">+2</DiffStat>
              <DiffStat kind="removed">-2</DiffStat>
            </DiffFileHeader>
            <DiffFilePanel>
              <DiffLine state="unchanged" number={1}>{`:root {`}</DiffLine>
              <DiffLine state="removed" number={2}>
                {`  --bg: `}
                <DiffWord>#111827</DiffWord>
                {`;`}
              </DiffLine>
              <DiffLine state="added" number={2}>
                {`  --bg: `}
                <DiffWord>#020617</DiffWord>
                {`;`}
              </DiffLine>
              <DiffLine
                state="unchanged"
                number={3}
              >{`  --panel: #1f2937;`}</DiffLine>
              <DiffSkip />
              <DiffLine state="unchanged" number={19}>
                {`  font-family: "Trebuchet MS", "Segoe UI", sans-serif;`}
              </DiffLine>
              <DiffLine state="removed" number={20}>
                {`  background: radial-gradient(circle at top, `}
                <DiffWord>#0f172a</DiffWord>
                {`, var(--bg));`}
              </DiffLine>
              <DiffLine state="added" number={20}>
                {`  background: radial-gradient(circle at top, `}
                <DiffWord>#0b1020</DiffWord>
                {`, var(--bg));`}
              </DiffLine>
              <DiffLine
                state="unchanged"
                number={21}
              >{`  color: var(--text);`}</DiffLine>
            </DiffFilePanel>
          </DiffFile>
        </DiffContent>
      </Diff>
    </div>
  );
}
