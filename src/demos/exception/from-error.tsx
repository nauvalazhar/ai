import { useMemo } from "react";
import {
  Exception,
  ExceptionContent,
  ExceptionFrame,
  ExceptionFrameFunction,
  ExceptionFrameLocation,
  ExceptionFrames,
  ExceptionHeader,
  ExceptionMessage,
  ExceptionType,
} from "#/components/ai/exception";

type ParsedFrame = {
  fn: string;
  location: string;
  internal: boolean;
};

type ParsedException = {
  type: string;
  message: string;
  frames: ParsedFrame[];
};

const INTERNAL = /node_modules|node:internal|\/react-dom\/|chrome-extension:/;
const WITH_FN = /^\s*at\s+(.+?)\s+\((.+?)\)\s*$/;
const NO_FN = /^\s*at\s+(.+?)\s*$/;

function parseError(err: Error): ParsedException {
  const stack = err.stack ?? "";
  const lines = stack.split("\n");

  let type = err.name || "Error";
  let message = err.message || "";

  const first = lines[0]?.trim() ?? "";
  if (!first.startsWith("at ") && first.includes(":")) {
    const idx = first.indexOf(":");
    type = first.slice(0, idx).trim();
    message = first.slice(idx + 1).trim();
  }

  const frames: ParsedFrame[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line.startsWith("at ")) continue;

    const withFn = line.match(WITH_FN);
    if (withFn) {
      const [, fn, location] = withFn;
      frames.push({ fn, location, internal: INTERNAL.test(location) });
      continue;
    }
    const noFn = line.match(NO_FN);
    if (noFn) {
      const [, location] = noFn;
      frames.push({ fn: "<anonymous>", location, internal: INTERNAL.test(location) });
    }
  }

  return { type, message, frames };
}

function thrower() {
  const user: { name: string } | undefined = undefined;
  return (user as unknown as { name: string }).name;
}

function caller() {
  return thrower();
}

function entry() {
  return caller();
}

export default function FromError() {
  const parsed = useMemo<ParsedException>(() => {
    try {
      entry();
      return { type: "Error", message: "no error thrown", frames: [] };
    } catch (e) {
      return parseError(e as Error);
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Exception defaultOpen>
        <ExceptionHeader>
          <ExceptionType>{parsed.type}</ExceptionType>
          <ExceptionMessage>{parsed.message}</ExceptionMessage>
        </ExceptionHeader>
        <ExceptionContent>
          <ExceptionFrames>
            {parsed.frames.map((frame, i) => (
              <ExceptionFrame
                key={i}
                active={i === 0 && !frame.internal}
                internal={frame.internal}
              >
                <ExceptionFrameFunction>{frame.fn}</ExceptionFrameFunction>
                <ExceptionFrameLocation>{frame.location}</ExceptionFrameLocation>
              </ExceptionFrame>
            ))}
          </ExceptionFrames>
        </ExceptionContent>
      </Exception>
    </div>
  );
}
