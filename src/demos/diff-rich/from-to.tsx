import {
  Diff,
  DiffContent,
  DiffHeader,
  DiffTitle,
} from "#/components/ai/diff";
import { DiffRichFile } from "#/components/ai/diff-rich";

const before = `:root {
  --bg: #111827;
  --panel: #1f2937;
  --text: #e5e7eb;
}

body {
  background: var(--bg);
  color: var(--text);
}`;

const after = `:root {
  --bg: #020617;
  --panel: #0f172a;
  --text: #f1f5f9;
  --accent: #38bdf8;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: "Inter", sans-serif;
}`;

export default function FromTo() {
  return (
    <div className="mx-auto max-w-2xl">
      <Diff>
        <DiffHeader>
          <DiffTitle>1 file changed</DiffTitle>
        </DiffHeader>
        <DiffContent>
          <DiffRichFile from={before} to={after} filename="theme.css" />
        </DiffContent>
      </Diff>
    </div>
  );
}
