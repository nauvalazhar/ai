// tested against @tanstack/ai@0.21.3, @tanstack/ai-client@0.11.7

import type { StreamChunk } from "@tanstack/ai";
import type {
  ConnectConnectionAdapter,
  RunAgentInputContext,
  UIMessage,
} from "@tanstack/ai-react";

export type Sleep = { delay: number };
export type ScriptStep = StreamChunk | Sleep;

export type BuildScriptArgs = {
  messages: Array<UIMessage>;
  runContext: RunAgentInputContext | undefined;
};

export type BuildScript = (args: BuildScriptArgs) => Iterable<ScriptStep>;

function isSleep(step: ScriptStep): step is Sleep {
  return (step as Sleep).delay !== undefined;
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    }
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

export function createMockAdapter(
  buildScript: BuildScript,
): ConnectConnectionAdapter {
  return {
    async *connect(messages, _data, abortSignal, runContext) {
      const script = buildScript({
        messages: messages as Array<UIMessage>,
        runContext,
      });
      for (const step of script) {
        if (abortSignal?.aborted) return;
        if (isSleep(step)) {
          await wait(step.delay, abortSignal);
          continue;
        }
        yield step;
      }
    },
  };
}
