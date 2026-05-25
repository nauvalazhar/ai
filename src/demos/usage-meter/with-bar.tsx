import {
  UsageBar,
  UsageMeter,
  UsageStat,
  UsageStatLabel,
  UsageStatValue,
} from "#/components/ai/usage-meter";

export default function WithBar() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <UsageMeter className="flex w-full">
        <UsageBar value={51_200} max={128_000}>
          <span>Context</span>
          <span className="tabular-nums text-foreground">
            51,200 / 128,000
          </span>
        </UsageBar>
      </UsageMeter>

      <UsageMeter className="flex w-full">
        <UsageBar value={117_400} max={128_000}>
          <span>Context</span>
          <span className="tabular-nums text-foreground">
            117,400 / 128,000
          </span>
        </UsageBar>
      </UsageMeter>

      <UsageMeter className="flex w-full">
        <UsageBar value={128_000} max={128_000}>
          <span>Context</span>
          <span className="tabular-nums text-foreground">128,000 / 128,000</span>
        </UsageBar>
        <UsageStat>
          <UsageStatLabel>Cost</UsageStatLabel>
          <UsageStatValue>$0.38</UsageStatValue>
        </UsageStat>
      </UsageMeter>
    </div>
  );
}
