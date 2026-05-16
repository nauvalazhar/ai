import { useEffect, useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { cn } from "#/lib/utils";
import { Sidebar } from "./sidebar";
import { useSidebarStore } from "./sidebar-store";

export function Explorer() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const close = useSidebarStore((s) => s.close);
  const setCollapsed = useSidebarStore((s) => s.set);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 767px)");
    if (mql.matches) setCollapsed(true);
    setHydrated(true);
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setCollapsed(true);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [setCollapsed]);

  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar"
        tabIndex={collapsed ? -1 : 0}
        onClick={close}
        className={cn(
          "md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-xs",
          hydrated
            ? cn(
                "transition-opacity duration-300",
                collapsed ? "opacity-0 pointer-events-none" : "opacity-100",
              )
            : "opacity-0 pointer-events-none",
        )}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-76 p-3 pr-4",
          hydrated
            ? cn(
                "transition-transform duration-500 ease-in-out",
                collapsed ? "-translate-x-full" : "translate-x-0",
              )
            : "max-md:-translate-x-full md:translate-x-0",
        )}
      >
        <aside className="flex flex-col py-2 bg-site-panel rounded-2xl ring ring-site-border h-full">
          <Sidebar />
        </aside>
      </div>

      <main
        className={cn(
          "min-h-dvh",
          hydrated && "transition-[padding-left] duration-500 ease-in-out",
          collapsed ? "md:pl-0" : "md:pl-76",
        )}
      >
        <Outlet />
      </main>
    </>
  );
}
