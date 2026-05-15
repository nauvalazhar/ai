import { useState } from "react";
import { Switch } from "#/components/ai/switch";

export default function Basic() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="mx-auto flex max-w-2xl items-center justify-center gap-6 py-10">
      <label className="flex items-center gap-2.5 text-sm text-foreground cursor-pointer">
        <Switch checked={enabled} onCheckedChange={setEnabled} />
        Turn on notifications
      </label>
    </div>
  );
}
