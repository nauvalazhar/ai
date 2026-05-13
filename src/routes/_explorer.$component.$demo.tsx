import { createFileRoute } from "@tanstack/react-router";
import { CodeView } from "#/components/playground/code-view";
import { PreviewView } from "#/components/playground/preview-view";
import {
  findComponent,
  findDemo,
  findDemoSource,
} from "#/components/playground/registry";
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
} from "#/components/playground/tabs";
import { CodeIcon, MousePointer2Icon, SidebarOpenIcon } from "lucide-react";
import { useSidebarStore } from "#/components/playground/sidebar-store";
import { cn } from "#/lib/utils";
import { Button } from "#/components/ai/button";

type Tab = "preview" | "code" | "docs";
const TABS: Tab[] = ["preview", "code", "docs"];

export const Route = createFileRoute("/_explorer/$component/$demo")({
  component: DemoView,
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => {
    const tab = search.tab as Tab | undefined;
    return tab && TABS.includes(tab) ? { tab } : {};
  },
  head: ({ params }) => {
    const componentName =
      findComponent(params.component)?.name ?? params.component;
    const demoName =
      findDemo(params.component, params.demo)?.name ?? params.demo;
    return {
      meta: [{ title: `${componentName} · ${demoName} — ai-kit` }],
    };
  },
});

function DemoView() {
  const { component, demo } = Route.useParams();
  const search = Route.useSearch();
  const tab: Tab = search.tab ?? "preview";
  const navigate = Route.useNavigate();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);

  const found = findDemo(component, demo);
  const source = findDemoSource(component, demo);
  const componentName = findComponent(component)?.name ?? component;
  const demoTitle = `${componentName} / ${found?.name ?? demo}`;

  function setTab(value: string | number | null) {
    if (typeof value === "string" && TABS.includes(value as Tab)) {
      navigate({ search: { tab: value as Tab }, replace: true });
    }
  }

  return (
    <div className="h-dvh flex flex-col min-h-0">
      <Tabs value={tab} onValueChange={setTab} className="flex-1">
        <div
          className={cn(
            "flex items-center gap-1.5",
            "absolute z-10 top-3 left-3 transition-all duration-500",
            !collapsed && "md:left-78.5",
          )}
        >
          <Button
            iconOnly
            variant="ghost"
            className={cn(
              "text-muted-foreground hover:text-foreground size-9.5",
              "transition-all",
              !collapsed && "md:-ml-10.5 md:opacity-0 md:pointer-events-none",
            )}
            onClick={toggle}
          >
            <SidebarOpenIcon />
          </Button>
          <TabsList>
            <TabsTab value="preview">
              <MousePointer2Icon />
              Preview
            </TabsTab>
            <TabsTab value="code">
              <CodeIcon />
              Code
            </TabsTab>
          </TabsList>
        </div>

        <TabsPanel value="preview">
          {found ? (
            <PreviewView src={`/demo/${component}/${demo}`} title={demoTitle} />
          ) : (
            <p className="text-sm text-muted-foreground p-4">
              Demo not found:{" "}
              <code className="font-mono">
                {component}/{demo}
              </code>
            </p>
          )}
        </TabsPanel>

        <TabsPanel value="code" className="min-h-0">
          {source ? (
            <CodeView code={source} />
          ) : (
            <p className="text-sm text-muted-foreground">Source unavailable.</p>
          )}
        </TabsPanel>
      </Tabs>
    </div>
  );
}
