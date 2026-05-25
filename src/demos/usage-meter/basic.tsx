import {
  UsageMeter,
  UsageStat,
  UsageStatLabel,
  UsageStatValue,
} from "#/components/ai/usage-meter";

export default function Basic() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 p-6">
      <UsageMeter>
        <UsageStat>
          <UsageStatLabel>Input</UsageStatLabel>
          <UsageStatValue>1,284</UsageStatValue>
        </UsageStat>
        <UsageStat>
          <UsageStatLabel>Output</UsageStatLabel>
          <UsageStatValue>612</UsageStatValue>
        </UsageStat>
        <UsageStat>
          <UsageStatLabel>Total</UsageStatLabel>
          <UsageStatValue>1,896</UsageStatValue>
        </UsageStat>
        <UsageStat>
          <UsageStatLabel>Cost</UsageStatLabel>
          <UsageStatValue>$0.0042</UsageStatValue>
        </UsageStat>
      </UsageMeter>
    </div>
  );
}
