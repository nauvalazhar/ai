import { createFileRoute } from "@tanstack/react-router";
import { HeroShowcase } from "#/components/playground/hero-showcase";

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [{ title: "Showcase – nauvalazhar/ai" }],
  }),
  component: Showcase,
});

function Showcase() {
  return (
    <div className="fixed inset-0 bg-background">
      <HeroShowcase />
    </div>
  );
}
