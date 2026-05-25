import { useEffect, useState } from "react";
import {
  AnimatedNumber,
  UsageBar,
  UsageMeter,
  UsageStat,
  UsageStatLabel,
  UsageStatValue,
} from "#/components/ai/usage-meter";

const CONTEXT_LIMIT = 128_000;

export default function Streaming() {
  const [input, setInput] = useState(0);
  const [output, setOutput] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setInput((prev) => {
        const next = prev + Math.floor(Math.random() * 1800) + 400;
        if (next + 6000 > CONTEXT_LIMIT) {
          setOutput(0);
          return 0;
        }
        return next;
      });
      setOutput((prev) => prev + Math.floor(Math.random() * 600) + 120);
    }, 600);
    return () => clearInterval(id);
  }, []);

  const total = input + output;
  const cost = input * 0.000003 + output * 0.000015;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <UsageMeter className="flex w-full">
        <UsageStat>
          <UsageStatLabel>Input</UsageStatLabel>
          <UsageStatValue>
            <AnimatedNumber value={input} />
          </UsageStatValue>
        </UsageStat>
        <UsageStat>
          <UsageStatLabel>Output</UsageStatLabel>
          <UsageStatValue>
            <AnimatedNumber value={output} />
          </UsageStatValue>
        </UsageStat>
        <UsageStat>
          <UsageStatLabel>Cost</UsageStatLabel>
          <UsageStatValue>
            <AnimatedNumber
              value={cost}
              format={(n) => `$${n.toFixed(4)}`}
            />
          </UsageStatValue>
        </UsageStat>
      </UsageMeter>

      <UsageMeter className="flex w-full">
        <UsageBar value={total} max={CONTEXT_LIMIT}>
          <span>Context</span>
          <span className="tabular-nums text-foreground">
            <AnimatedNumber value={total} /> / 128,000
          </span>
        </UsageBar>
      </UsageMeter>
    </div>
  );
}
