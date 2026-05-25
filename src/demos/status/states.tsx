import { Status } from "#/components/ai/status";

export default function States() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6 p-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Status state="neutral">Idle</Status>
        <Status state="pending">Queued</Status>
        <Status state="inflight" pulse>Running</Status>
        <Status state="warning">Degraded</Status>
        <Status state="active">Ready</Status>
        <Status state="error">Failed</Status>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Status state="neutral" size="sm">Idle</Status>
        <Status state="pending" size="sm">Queued</Status>
        <Status state="inflight" size="sm" pulse>Running</Status>
        <Status state="warning" size="sm">Degraded</Status>
        <Status state="active" size="sm">Ready</Status>
        <Status state="error" size="sm">Failed</Status>
      </div>
    </div>
  );
}
