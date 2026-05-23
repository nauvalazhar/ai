"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import { useMemo, type ReactNode } from "react";
import {
  diffLines as jsDiffLines,
  diffWordsWithSpace as jsDiffWords,
  parsePatch as jsParsePatch,
} from "diff";
import { cn } from "#/lib/utils";

type LineState = "added" | "removed" | "unchanged";

type StatKind = "added" | "removed";

export function Diff({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="diff"
      className={cn(
        "flex flex-col rounded-outer bg-surface ring ring-border",
        className,
      )}
      {...props}
    />
  );
}

export function DiffHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="diff-header"
      className={cn("flex items-center gap-2 px-4 h-11", className)}
      {...props}
    />
  );
}

export function DiffTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="diff-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

export function DiffAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="diff-action"
      className={cn(
        "ml-auto flex items-center gap-1",
        "**:[button]:text-sm **:[svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

export function DiffContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="diff-content"
      className={cn("flex flex-col gap-2 px-1 pb-1", className)}
      {...props}
    />
  );
}

export function DiffFile({
  defaultOpen = true,
  className,
  ...props
}: Collapsible.Root.Props) {
  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      data-slot="diff-file"
      className={cn(
        "group/diff-file flex flex-col rounded bg-surface-elevated ring ring-border overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

export function DiffFileHeader({
  className,
  children,
  ...props
}: Collapsible.Trigger.Props) {
  return (
    <Collapsible.Trigger
      data-slot="diff-file-header"
      className={cn(
        "flex items-center gap-2 px-3 h-9 bg-transparent cursor-pointer select-none text-left",
        "border-b border-transparent group-data-open/diff-file:border-border rounded",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
        "transition-colors hover:bg-accent",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={cn(
          "ml-auto size-4 shrink-0 text-muted-foreground",
          "transition-transform duration-200",
          "group-data-open/diff-file:rotate-180",
        )}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </Collapsible.Trigger>
  );
}

export function DiffFileName({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="diff-file-name"
      className={cn(
        "min-w-0 truncate font-mono text-xs text-foreground",
        className,
      )}
      {...props}
    />
  );
}

type DiffStatProps = React.ComponentProps<"span"> & {
  kind: StatKind;
};

export function DiffStat({ kind, className, ...props }: DiffStatProps) {
  return (
    <span
      data-slot="diff-stat"
      data-kind={kind}
      className={cn(
        "font-mono text-xs tabular-nums",
        "data-[kind=added]:text-diff-added",
        "data-[kind=removed]:text-diff-removed",
        className,
      )}
      {...props}
    />
  );
}

export function DiffFilePanel({
  className,
  children,
  ...props
}: Collapsible.Panel.Props) {
  return (
    <Collapsible.Panel
      data-slot="diff-file-panel"
      className={cn(
        "overflow-hidden",
        "h-(--collapsible-panel-height)",
        "transition-[height] duration-200 ease-out",
        "data-starting-style:h-0 data-ending-style:h-0",
        className,
      )}
      {...props}
    >
      <div className="py-2">{children}</div>
    </Collapsible.Panel>
  );
}

type DiffLineProps = Omit<React.ComponentProps<"div">, "children"> & {
  state: LineState;
  number?: number;
  children?: ReactNode;
};

export function DiffLine({
  state,
  number,
  className,
  children,
  ...props
}: DiffLineProps) {
  return (
    <div
      data-slot="diff-line"
      data-state={state}
      className={cn(
        "group/diff-line",
        "grid grid-cols-[2.5rem_1fr] items-stretch",
        "font-mono text-sm leading-6",
        "data-[state=added]:bg-diff-added/15",
        "data-[state=removed]:bg-diff-removed/15",
        "relative",
        "data-[state=added]:before:absolute data-[state=added]:before:inset-y-0 data-[state=added]:before:left-0 data-[state=added]:before:w-0.5 data-[state=added]:before:bg-diff-added",
        "data-[state=removed]:before:absolute data-[state=removed]:before:inset-y-0 data-[state=removed]:before:left-0 data-[state=removed]:before:w-0.5 data-[state=removed]:before:bg-diff-removed",
        className,
      )}
      {...props}
    >
      <DiffLineNumber>{number ?? ""}</DiffLineNumber>
      <DiffLineContent>{children}</DiffLineContent>
    </div>
  );
}

export function DiffLineNumber({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="diff-line-number"
      className={cn(
        "select-none text-right pr-3 pl-2 tabular-nums text-muted-foreground",
        "group-data-[state=added]/diff-line:text-diff-added",
        "group-data-[state=removed]/diff-line:text-diff-removed",
        className,
      )}
      {...props}
    />
  );
}

export function DiffLineContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="diff-line-content"
      className={cn("min-w-0 whitespace-pre pr-4 text-foreground", className)}
      {...props}
    />
  );
}

export function DiffWord({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="diff-word"
      className={cn(
        "rounded-sm",
        "group-data-[state=added]/diff-line:bg-diff-added/35",
        "group-data-[state=removed]/diff-line:bg-diff-removed/35",
        className,
      )}
      {...props}
    />
  );
}

export function DiffSkip({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="diff-skip"
      className={cn(
        "grid grid-cols-[2.5rem_1fr] items-center",
        "h-6 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    >
      <div aria-hidden className="text-center">
        ⋯
      </div>
      <div className="pr-4 truncate">{children}</div>
    </div>
  );
}

export function DiffRow({ entry }: { entry: DiffEntry }) {
  if (entry.state === "skip") return <DiffSkip />;
  const number = entry.state === "removed" ? entry.oldNumber : entry.newNumber;
  return (
    <DiffLine state={entry.state} number={number}>
      {entry.segments
        ? entry.segments.map((s, i) =>
            s.mark ? <DiffWord key={i}>{s.value}</DiffWord> : s.value,
          )
        : entry.text}
    </DiffLine>
  );
}

export type DiffSegment = { value: string; mark?: boolean };

export type DiffEntry =
  | {
      state: "added" | "removed" | "unchanged";
      text: string;
      oldNumber?: number;
      newNumber?: number;
      segments?: DiffSegment[];
      key: string;
    }
  | {
      state: "skip";
      count?: number;
      key: string;
    };

export type DiffResult = {
  name?: string;
  additions: number;
  removals: number;
  lines: DiffEntry[];
};

export type UseDiffInput =
  | {
      from: string;
      to: string;
      patch?: undefined;
      wordLevel?: boolean;
      contextLines?: number;
    }
  | {
      patch: string;
      from?: undefined;
      to?: undefined;
      wordLevel?: boolean;
      contextLines?: number;
    };

export function useDiff(input: UseDiffInput): DiffResult {
  const wordLevel = input.wordLevel ?? true;
  const contextLines = input.contextLines;
  return useMemo(() => {
    if (input.patch !== undefined) {
      return computeFromPatch(input.patch, wordLevel);
    }
    if (input.from !== undefined && input.to !== undefined) {
      const result = computeFromStrings(input.from, input.to, wordLevel);
      if (contextLines !== undefined) {
        return {
          ...result,
          lines: collapseContext(result.lines, contextLines),
        };
      }
      return result;
    }
    return { additions: 0, removals: 0, lines: [] };
  }, [input.from, input.to, input.patch, wordLevel, contextLines]);
}

function collapseContext(lines: DiffEntry[], context: number): DiffEntry[] {
  if (context < 0 || lines.length === 0) return lines;
  const result: DiffEntry[] = [];
  let keyCounter = 0;
  let i = 0;
  let seenChange = false;
  while (i < lines.length) {
    const entry = lines[i];
    if (entry.state !== "unchanged") {
      if (entry.state === "added" || entry.state === "removed") {
        seenChange = true;
      }
      result.push(entry);
      i++;
      continue;
    }
    let j = i;
    while (j < lines.length && lines[j].state === "unchanged") j++;
    const runLength = j - i;
    const isLeading = !seenChange;
    const isTrailing = j === lines.length;
    if (isLeading && isTrailing) {
      for (let k = i; k < j; k++) result.push(lines[k]);
    } else if (isLeading) {
      const keep = Math.min(context, runLength);
      const skipCount = runLength - keep;
      if (skipCount > 0) {
        result.push({
          state: "skip",
          count: skipCount,
          key: `cs-${keyCounter++}`,
        });
      }
      for (let k = j - keep; k < j; k++) result.push(lines[k]);
    } else if (isTrailing) {
      const keep = Math.min(context, runLength);
      const skipCount = runLength - keep;
      for (let k = i; k < i + keep; k++) result.push(lines[k]);
      if (skipCount > 0) {
        result.push({
          state: "skip",
          count: skipCount,
          key: `cs-${keyCounter++}`,
        });
      }
    } else {
      if (runLength <= 2 * context) {
        for (let k = i; k < j; k++) result.push(lines[k]);
      } else {
        for (let k = i; k < i + context; k++) result.push(lines[k]);
        const skipCount = runLength - 2 * context;
        result.push({
          state: "skip",
          count: skipCount,
          key: `cs-${keyCounter++}`,
        });
        for (let k = j - context; k < j; k++) result.push(lines[k]);
      }
    }
    i = j;
  }
  return result;
}

function computeFromStrings(
  from: string,
  to: string,
  wordLevel: boolean,
): DiffResult {
  const parts = jsDiffLines(from, to);
  const lines: DiffEntry[] = [];
  let additions = 0;
  let removals = 0;
  let oldNo = 0;
  let newNo = 0;
  let keyCounter = 0;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part.added && !part.removed) {
      const split = splitLines(part.value);
      for (const text of split) {
        oldNo += 1;
        newNo += 1;
        lines.push({
          state: "unchanged",
          text,
          oldNumber: oldNo,
          newNumber: newNo,
          key: `u-${keyCounter++}`,
        });
      }
      continue;
    }

    const next = parts[i + 1];
    const paired = part.removed && next && next.added;

    if (paired) {
      const removedLines = splitLines(part.value);
      const addedLines = splitLines(next.value);
      const maxLen = Math.max(removedLines.length, addedLines.length);
      for (let j = 0; j < maxLen; j++) {
        const r = removedLines[j];
        const a = addedLines[j];
        const wordPair =
          wordLevel && r !== undefined && a !== undefined
            ? wordSegments(r, a)
            : null;
        if (r !== undefined) {
          oldNo += 1;
          removals += 1;
          lines.push({
            state: "removed",
            text: r,
            oldNumber: oldNo,
            segments: wordPair?.removed,
            key: `r-${keyCounter++}`,
          });
        }
        if (a !== undefined) {
          newNo += 1;
          additions += 1;
          lines.push({
            state: "added",
            text: a,
            newNumber: newNo,
            segments: wordPair?.added,
            key: `a-${keyCounter++}`,
          });
        }
      }
      i += 1;
      continue;
    }

    const split = splitLines(part.value);
    for (const text of split) {
      if (part.removed) {
        oldNo += 1;
        removals += 1;
        lines.push({
          state: "removed",
          text,
          oldNumber: oldNo,
          key: `r-${keyCounter++}`,
        });
      } else if (part.added) {
        newNo += 1;
        additions += 1;
        lines.push({
          state: "added",
          text,
          newNumber: newNo,
          key: `a-${keyCounter++}`,
        });
      }
    }
  }

  return { additions, removals, lines };
}

function wordSegments(
  removed: string,
  added: string,
): { removed: DiffSegment[]; added: DiffSegment[] } {
  const segs = jsDiffWords(removed, added);
  const r: DiffSegment[] = [];
  const a: DiffSegment[] = [];
  for (const seg of segs) {
    if (seg.added) a.push({ value: seg.value, mark: true });
    else if (seg.removed) r.push({ value: seg.value, mark: true });
    else {
      r.push({ value: seg.value });
      a.push({ value: seg.value });
    }
  }
  return { removed: r, added: a };
}

function splitLines(value: string): string[] {
  const arr = value.split("\n");
  if (arr.length > 0 && arr[arr.length - 1] === "" && value.endsWith("\n")) {
    arr.pop();
  }
  return arr;
}

function computeFromPatch(patch: string, wordLevel: boolean): DiffResult {
  const parsed = jsParsePatch(patch)[0];
  if (!parsed) return { additions: 0, removals: 0, lines: [] };
  const name = stripPatchPath(
    parsed.newFileName ?? parsed.oldFileName ?? undefined,
  );
  let additions = 0;
  let removals = 0;
  const lines: DiffEntry[] = [];
  let keyCounter = 0;
  let lastOldEnd = 1;

  for (let hi = 0; hi < parsed.hunks.length; hi++) {
    const h = parsed.hunks[hi];
    const skipCount = h.oldStart - lastOldEnd;
    const skipFirst = hi === 0 && h.oldStart > 1 ? h.oldStart - 1 : 0;
    const skip = skipFirst > 0 ? skipFirst : skipCount > 0 ? skipCount : 0;
    if (skip > 0) {
      lines.push({ state: "skip", count: skip, key: `s-${keyCounter++}` });
    }
    let oldNo = h.oldStart;
    let newNo = h.newStart;
    const raw = h.lines;
    for (let i = 0; i < raw.length; i++) {
      const line = raw[i];
      const marker = line[0];
      const text = line.slice(1);
      if (marker === "-") {
        const next = raw[i + 1];
        const paired = next && next[0] === "+";
        if (paired && wordLevel) {
          const pair = wordSegments(text, next.slice(1));
          lines.push({
            state: "removed",
            text,
            oldNumber: oldNo,
            segments: pair.removed,
            key: `r-${keyCounter++}`,
          });
          lines.push({
            state: "added",
            text: next.slice(1),
            newNumber: newNo,
            segments: pair.added,
            key: `a-${keyCounter++}`,
          });
          removals += 1;
          additions += 1;
          oldNo += 1;
          newNo += 1;
          i += 1;
        } else {
          lines.push({
            state: "removed",
            text,
            oldNumber: oldNo,
            key: `r-${keyCounter++}`,
          });
          removals += 1;
          oldNo += 1;
        }
      } else if (marker === "+") {
        lines.push({
          state: "added",
          text,
          newNumber: newNo,
          key: `a-${keyCounter++}`,
        });
        additions += 1;
        newNo += 1;
      } else {
        lines.push({
          state: "unchanged",
          text,
          oldNumber: oldNo,
          newNumber: newNo,
          key: `u-${keyCounter++}`,
        });
        oldNo += 1;
        newNo += 1;
      }
    }
    lastOldEnd = h.oldStart + h.oldLines;
  }

  return { name, additions, removals, lines };
}

function stripPatchPath(name: string | undefined): string | undefined {
  if (!name) return undefined;
  if (name === "/dev/null") return undefined;
  return name.replace(/^[ab]\//, "");
}
