import { SidebarOpenIcon } from "lucide-react";
import { cn } from "#/lib/utils";
import { Button } from "../ai/button";
import { useSidebarStore } from "./sidebar-store";

export function SidebarOpenToggle() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);

  return (
    <div
      className={cn(
        "fixed left-1.5 lg:left-3 top-3 z-20",
        "transition-all duration-500",
        collapsed ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <Button
        iconOnly
        variant="ghost"
        className="text-muted-foreground hover:text-foreground size-9.5"
        onClick={toggle}
      >
        <SidebarOpenIcon />
      </Button>
    </div>
  );
}
