import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AccessibilityIcon,
  ActivityIcon,
  BlocksIcon,
  BracesIcon,
  GitForkIcon,
  LayersIcon,
  type LucideIcon,
} from "lucide-react";
import { Button } from "#/components/ai/button";
import { SidebarOpenToggle } from "#/components/playground/sidebar-toggle";

export const Route = createFileRoute("/_explorer/")({
  head: () => ({
    meta: [
      {
        title: "The interface for your favorite AI SDK – nauvalazhar/ai",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      <SidebarOpenToggle />
      <div className="relative isolate overflow-hidden">
        <HeroBackground />
        <div className="pointer-events-none mx-auto w-full max-w-6xl px-6 pb-24 pt-16">
          <Hero />
          <Features />
        </div>
      </div>
    </>
  );
}

function Hero() {
  return (
    <section className="pointer-events-none relative flex flex-col items-center text-center py-20 lg:py-40">
      <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold tracking-tight text-foreground md:text-7xl">
        The interface for your favorite AI SDK
      </h1>

      <p className="mt-4 max-w-2xl text-balance text-base text-muted-foreground">
        Agnostic by design. Components hold no opinions about your data layer
        and work with any AI SDK in React.
      </p>

      <div className="pointer-events-auto mt-7 flex flex-wrap items-center justify-center gap-2">
        <Button render={<Link to="/installation/{-$framework}" />}>
          Get Started
        </Button>
        <Button render={<Link to="/introduction" />} variant="ghost">
          Introduction
        </Button>
      </div>
    </section>
  );
}

const HERO_GRID_COLS = 32;
const HERO_GRID_ROWS = 12;
const HERO_CELL_SIZE = 60;

function HeroBackground() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 -z-10 h-170 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 75% 95% at 50% 0%, black 30%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 95% at 50% 0%, black 30%, transparent 80%)",
      }}
    >
      <div
        className="mx-auto grid"
        style={{
          gridTemplateColumns: `repeat(${HERO_GRID_COLS}, ${HERO_CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${HERO_GRID_ROWS}, ${HERO_CELL_SIZE}px)`,
          width: HERO_GRID_COLS * HERO_CELL_SIZE,
          height: HERO_GRID_ROWS * HERO_CELL_SIZE,
        }}
      >
        {Array.from({ length: HERO_GRID_COLS * HERO_GRID_ROWS }).map(
          (_, idx) => (
            <div
              key={idx}
              className="border border-foreground/3 transition-colors duration-1200 ease-out hover:bg-foreground/3 hover:duration-0"
            />
          ),
        )}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="pointer-events-auto mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
        title="Own the code"
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
      <div className="flex flex-col gap-3 rounded dark:bg-surface-elevated p-5 ring ring-border h-full">
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
