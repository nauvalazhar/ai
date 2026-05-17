import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ai/button";

type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  const saved = localStorage.getItem("aikit-theme");
  if (saved === "dark" || saved === "light") return saved;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange(e: MediaQueryListEvent) {
      if (localStorage.getItem("aikit-theme")) return;
      const next: Theme = e.matches ? "dark" : "light";
      setTheme(next);
      document.documentElement.classList.toggle("dark", e.matches);
    }
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("aikit-theme", next);
  }

  return (
    <Button onClick={toggle} variant="ghost" iconOnly aria-label="Toggle theme">
      {theme === "light" ? (
        <Moon className="size-4.5" />
      ) : (
        <Sun className="size-4.5" />
      )}
    </Button>
  );
}
