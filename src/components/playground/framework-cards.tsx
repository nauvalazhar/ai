import { Link } from "@tanstack/react-router";
import { SiShadcnui } from "react-icons/si";

const frameworks: Array<{
  slug: string;
  title: string;
  description: string;
  icon: string | "shadcn";
}> = [
  {
    slug: "vite",
    title: "Vite",
    description:
      "Drop the kit into your project and start building right away.",
    icon: "/vitejs.svg",
  },
  {
    slug: "next",
    title: "Next.js",
    description: "Slot the kit into your app and keep the rest of your setup.",
    icon: "/nextjs.svg",
  },
  {
    slug: "react-router",
    title: "React Router",
    description: "Bring the kit into your app with a single command.",
    icon: "/reactrouter.svg",
  },
  {
    slug: "tanstack-start",
    title: "TanStack Start",
    description: "Wire the kit into your project in a couple of commands.",
    icon: "/tanstack.svg",
  },
  {
    slug: "shadcn",
    title: "shadcn CLI",
    description: "Already on shadcn? Pull the kit through your existing CLI.",
    icon: "shadcn",
  },
  {
    slug: "manual",
    title: "Manual",
    description:
      "Step through the setup by hand when the CLI is not an option.",
    icon: "/reactjs.svg",
  },
];

export function FrameworkCards() {
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {frameworks.map((fw) => (
        <Link
          key={fw.slug}
          to="/installation/{-$framework}"
          params={{ framework: fw.slug }}
          className="group p-1 bg-surface ring ring-border rounded-outer outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="flex h-full gap-3.5 rounded p-5 ring ring-border dark:bg-surface-elevated hover:bg-accent transition-colors duration-150">
            {fw.icon === "shadcn" ? (
              <SiShadcnui className="size-7 mt-1" />
            ) : (
              <img
                src={fw.icon}
                alt={fw.title}
                className="size-7 mt-1 object-contain"
              />
            )}
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-foreground">{fw.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {fw.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
