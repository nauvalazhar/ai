import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AccessibilityIcon,
  ActivityIcon,
  ArrowRightIcon,
  BlocksIcon,
  BracesIcon,
  GitForkIcon,
  LayersIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import { SidebarOpenToggle } from "#/components/playground/sidebar-toggle";

export const Route = createFileRoute("/_explorer/")({
  component: Landing,
});

function Landing() {
  return (
    <>
      <SidebarOpenToggle />
      <div className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
        <Hero />
        <Features />
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className="flex flex-col items-center text-center py-20">
      <Link
        to="/$component"
        params={{ component: "prompt" }}
        className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground ring ring-border hover:bg-accent transition-colors"
      >
        Now with preset prompts
        <ArrowRightIcon className="size-3.5 text-muted-foreground" />
      </Link>

      <h1 className="mt-6 max-w-3xl text-balance text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        Components for AI interfaces
      </h1>

      <p className="mt-4 max-w-2xl text-balance text-base text-muted-foreground">
        Composable React primitives for chat, reasoning, tools, and agents. Edit
        the source, theme with your tokens, ship.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        <Button
          render={<Link to="/$component" params={{ component: "action" }} />}
        >
          Browse Components
        </Button>
        <Button
          render={
            <Link
              to="/$component/$demo"
              params={{ component: "prompt", demo: "basic" }}
            />
          }
          variant="ghost"
        >
          View Demos
        </Button>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <FeatureCard
        icon={BlocksIcon}
        title="Composable"
        description="Each surface is assembled from small headless pieces. Rearrange them to match the shape of your product."
      />
      <FeatureCard
        icon={ActivityIcon}
        title="Built for streaming"
        description="Reasoning, tool calls, and replies render as they arrive, not after."
      />
      <FeatureCard
        icon={LayersIcon}
        title="Beyond chat"
        description="Tools, reasoning, approvals, and tasks are first-class. Build agents, harnesses, or whatever surface your model needs."
      />
      <FeatureCard
        icon={AccessibilityIcon}
        title="Accessible by default"
        description="Focus rings, keyboard navigation, and ARIA semantics are wired up before you start styling."
      />
      <FeatureCard
        icon={BracesIcon}
        title="TypeScript first"
        description="Variant unions, discriminated props, and inferred slots. Autocomplete tells you what each part does."
      />
      <FeatureCard
        icon={GitForkIcon}
        title="Copy, don't install"
        description="Components live in your repo. Edit them, fork them, and own the surface area you ship."
      />
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="p-1 bg-surface ring ring-border rounded-outer">
      <div className="flex flex-col gap-3 rounded bg-surface-elevated p-5 ring ring-border h-full">
        <Icon className="size-5.5 mb-2" strokeWidth={1.5} />
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-foreground">{title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
