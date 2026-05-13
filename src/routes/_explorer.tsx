import { createFileRoute } from "@tanstack/react-router";
import { Explorer } from "#/components/playground/explorer";

export const Route = createFileRoute("/_explorer")({
  component: Explorer,
});
