import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Collapsible } from "@base-ui/react/collapsible";
import {
  BookOpenIcon,
  ChevronRight,
  DownloadIcon,
  Folder,
  FolderOpen,
  SidebarCloseIcon,
} from "lucide-react";
import { cn } from "#/lib/utils";
import { registry } from "./registry.config";
import { SiGithub, SiReact } from "react-icons/si";
import { Button } from "../ai/button";
import { useSidebarStore } from "./sidebar-store";
import { Chip } from "../ai/chip";
import { ScrollArea } from "../ai/scroll-area";
import { ThemeToggle } from "./theme-toggle";

export function Sidebar() {
  const toggle = useSidebarStore((s) => s.toggle);
  const close = useSidebarStore((s) => s.close);
  const params = useParams({ strict: false }) as {
    component?: string;
    demo?: string;
  };
  const activeComponent = params.component;
  const activeDemo = params.demo;

  function closeOnMobile() {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      close();
    }
  }

  const [expanded, setExpanded] = useState<Set<string>>(() =>
    activeComponent ? new Set([activeComponent]) : new Set(),
  );

  useEffect(() => {
    if (!activeComponent) return;
    setExpanded((prev) =>
      prev.has(activeComponent) ? prev : new Set([...prev, activeComponent]),
    );
  }, [activeComponent]);

  const isEmpty = registry.every((g) => g.components.length === 0);

  return (
    <>
      <header className="px-6 py-2 flex">
        <Link
          to="/"
          onClick={closeOnMobile}
          className={cn(
            "flex items-center text-sm font-medium px-2.5 py-2 rounded -ml-2.5 -mt-1 hover:bg-accent transition-colors duration-150",
            "focus-visible:ring-2 focus-visible:ring-primary outline-0",
          )}
        >
          <img src="/logo.webp" alt="Logo" className="size-5.5 mr-2.5" />
          nauvalazhar/ai
        </Link>
        <div className="flex items-center ml-auto gap-0.5">
          <ThemeToggle />
          <Button
            iconOnly
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
            onClick={toggle}
          >
            <SidebarCloseIcon className="size-4" />
          </Button>
        </div>
      </header>
      <div className="pb-2 px-6">
        <p className="text-xs leading-relaxed text-muted-foreground mb-4">
          React components for building agentic AI applications.
        </p>
        <Chip
          render={
            <a
              href="https://github.com/nauvalazhar/ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs"
            >
              <SiGithub />
              GitHub
            </a>
          }
          className="ring-foreground/15"
        />
      </div>
      <ScrollArea render={<nav />} className="flex-1 overflow-y-auto mt-2">
        <section className="mb-3">
          <div className="px-6 py-1 text-xs font-medium text-muted-foreground">
            Get Started
          </div>
          <ul
            className={cn(
              "px-4 relative before:w-px before:h-full before:bg-border before:absolute",
              "before:left-7",
            )}
          >
            <li className="mb-0.5">
              <Link
                to="/introduction"
                onClick={closeOnMobile}
                className={cn(
                  "flex items-center gap-2 pl-5.5 pr-2 py-1 rounded text-sm",
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
                  "data-[status=active]:bg-accent data-[status=active]:text-foreground",
                  "outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "transition-colors duration-150",
                )}
              >
                <BookOpenIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">Introduction</span>
              </Link>
            </li>
            <li className="mb-0.5">
              <Link
                to="/installation"
                onClick={closeOnMobile}
                className={cn(
                  "flex items-center gap-2 pl-5.5 pr-2 py-1 rounded text-sm",
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
                  "data-[status=active]:bg-accent data-[status=active]:text-foreground",
                  "outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  "transition-colors duration-150",
                )}
              >
                <DownloadIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">Installation</span>
              </Link>
            </li>
          </ul>
        </section>
        {isEmpty ? (
          <p className="px-6 py-2 text-xs text-muted-foreground">
            No components yet.
          </p>
        ) : (
          registry.map((group) => (
            <section key={group.title} className="mb-3">
              <div className="px-6 py-1 text-xs font-medium text-muted-foreground">
                {group.title}
              </div>
              <ul className="px-4">
                {group.components
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((component) => {
                    const isExpanded = expanded.has(component.slug);
                    const isActiveBranch = activeComponent === component.slug;

                    return (
                      <li key={component.slug} className="mb-0.5">
                        <Collapsible.Root
                          className="group"
                          open={isExpanded}
                          onOpenChange={(open) =>
                            setExpanded((prev) => {
                              const next = new Set(prev);
                              if (open) next.add(component.slug);
                              else next.delete(component.slug);
                              return next;
                            })
                          }
                        >
                          <div
                            className={cn(
                              "flex items-center rounded text-sm",
                              "hover:bg-accent",
                              isActiveBranch &&
                                !activeDemo &&
                                "bg-accent text-foreground",
                            )}
                          >
                            <Collapsible.Trigger
                              className="p-1 text-muted-foreground hover:text-foreground rounded outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              aria-label={isExpanded ? "Collapse" : "Expand"}
                            >
                              <ChevronRight className="size-3.5 transition-transform group-data-open:rotate-90" />
                            </Collapsible.Trigger>
                            <Link
                              to="/$component"
                              params={{ component: component.slug }}
                              onClick={() => {
                                setExpanded((prev) =>
                                  prev.has(component.slug)
                                    ? prev
                                    : new Set([...prev, component.slug]),
                                );
                                closeOnMobile();
                              }}
                              className={cn(
                                "flex items-center gap-2 flex-1 min-w-0 py-1 pr-2",
                                "outline-none focus-visible:ring-2 focus-visible:ring-primary rounded",
                                "transition-colors duration-150",
                                isActiveBranch
                                  ? "text-foreground"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {isExpanded ? (
                                <FolderOpen className="size-4 shrink-0 text-muted-foreground" />
                              ) : (
                                <Folder className="size-4 shrink-0 text-muted-foreground" />
                              )}
                              <span className="truncate">{component.name}</span>
                            </Link>
                          </div>

                          <Collapsible.Panel
                            className={cn(
                              "overflow-hidden h-(--collapsible-panel-height)",
                              "transition-[height] duration-150 ease-out",
                              "data-starting-style:h-0 data-ending-style:h-0",
                            )}
                          >
                            <ul className="ml-2.5 pl-1.5 border-l border-border mt-0.5 space-y-0.5">
                              {component.demos.map((demo) => (
                                <li key={demo.slug}>
                                  <Link
                                    to="/$component/$demo"
                                    params={{
                                      component: component.slug,
                                      demo: demo.slug,
                                    }}
                                    onClick={closeOnMobile}
                                    className={cn(
                                      "flex items-center gap-2 px-1.5 py-1 rounded text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                                      "data-[status=active]:bg-accent data-[status=active]:text-foreground",
                                      "transition-colors duration-150",
                                      "outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                    )}
                                  >
                                    <SiReact className="size-3.5 shrink-0" />
                                    <span className="truncate">
                                      {demo.name}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </Collapsible.Panel>
                        </Collapsible.Root>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))
        )}
      </ScrollArea>
      <footer className="px-6 pb-2 pt-4 flex">
        <p className="text-xs text-muted-foreground">
          Designed by{" "}
          <a
            href="https://nauv.al"
            className="border-b border-foreground text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nauval
          </a>{" "}
          at{" "}
          <a
            href="https://enterprise.kredibel.com"
            className="border-b border-foreground text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kredibel
          </a>
        </p>
      </footer>
      {/* <ThemeToggle /> */}
    </>
  );
}
