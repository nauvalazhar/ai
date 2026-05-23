import {
  Diff,
  DiffContent,
  DiffHeader,
  DiffTitle,
} from "#/components/ai/diff";
import { DiffRichFile } from "#/components/ai/diff-rich";

const before = `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((n) => n + 1)}>
      Clicked {count} times
    </button>
  );
}`;

const after = `import { useState } from "react";

export function Counter({ start = 0 }) {
  const [count, setCount] = useState(start);
  return (
    <button onClick={() => setCount((n) => n + 1)}>
      Clicked {count} times
    </button>
  );
}`;

export default function Basic() {
  return (
    <div className="mx-auto max-w-2xl">
      <Diff>
        <DiffHeader>
          <DiffTitle>1 file changed</DiffTitle>
        </DiffHeader>
        <DiffContent>
          <DiffRichFile from={before} to={after} filename="counter.tsx" />
        </DiffContent>
      </Diff>
    </div>
  );
}
