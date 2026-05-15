import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ai/select";

export default function Icon() {
  return (
    <div className="mx-auto w-64 py-10">
      <Select defaultValue={{ value: "system", label: "System", icon: <MonitorIcon /> }}>
        <SelectTrigger>
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            <SelectItem value={{ value: "light", label: "Light", icon: <SunIcon /> }}>
              <SunIcon />
              Light
            </SelectItem>
            <SelectItem value={{ value: "dark", label: "Dark", icon: <MoonIcon /> }}>
              <MoonIcon />
              Dark
            </SelectItem>
            <SelectItem value={{ value: "system", label: "System", icon: <MonitorIcon /> }}>
              <MonitorIcon />
              System
            </SelectItem>
          </SelectList>
        </SelectPopup>
      </Select>
    </div>
  );
}
