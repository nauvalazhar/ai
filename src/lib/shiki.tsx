"use client";

import { ShikiHighlighter as BaseShikiHighlighter } from "react-shiki/core";
import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { useEffect, useState, type ComponentProps } from "react";

let cached: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  if (!cached) {
    cached = createHighlighterCore({
      themes: [
        import("@shikijs/themes/github-light"),
        import("@shikijs/themes/github-dark"),
      ],
      langs: [
        import("@shikijs/langs/tsx"),
        import("@shikijs/langs/typescript"),
        import("@shikijs/langs/json"),
        import("@shikijs/langs/sql"),
        import("@shikijs/langs/python"),
        import("@shikijs/langs/bash"),
      ],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  }
  return cached;
}

type Props = Omit<ComponentProps<typeof BaseShikiHighlighter>, "highlighter">;

export default function ShikiHighlighter(props: Props) {
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter().then((h) => {
      if (!cancelled) setHighlighter(h);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!highlighter) return null;
  return <BaseShikiHighlighter {...props} highlighter={highlighter} />;
}
