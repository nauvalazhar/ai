"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createHighlighterCore,
  type HighlighterCore,
  type ThemedToken,
} from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import {
  DiffFile,
  DiffFileHeader,
  DiffFileName,
  DiffFilePanel,
  DiffLine,
  DiffRow,
  DiffSkip,
  DiffStat,
  useDiff,
} from "#/components/ai/diff";

let cachedHighlighter: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  if (!cachedHighlighter) {
    cachedHighlighter = createHighlighterCore({
      themes: [
        import("@shikijs/themes/github-light"),
        import("@shikijs/themes/github-dark"),
      ],
      langs: [
        import("@shikijs/langs/tsx"),
        import("@shikijs/langs/typescript"),
        import("@shikijs/langs/jsx"),
        import("@shikijs/langs/javascript"),
        import("@shikijs/langs/json"),
        import("@shikijs/langs/jsonc"),
        import("@shikijs/langs/css"),
        import("@shikijs/langs/scss"),
        import("@shikijs/langs/sass"),
        import("@shikijs/langs/less"),
        import("@shikijs/langs/html"),
        import("@shikijs/langs/xml"),
        import("@shikijs/langs/markdown"),
        import("@shikijs/langs/yaml"),
        import("@shikijs/langs/toml"),
        import("@shikijs/langs/python"),
        import("@shikijs/langs/ruby"),
        import("@shikijs/langs/rust"),
        import("@shikijs/langs/go"),
        import("@shikijs/langs/java"),
        import("@shikijs/langs/php"),
        import("@shikijs/langs/shellscript"),
        import("@shikijs/langs/sql"),
        import("@shikijs/langs/diff"),
        import("@shikijs/langs/docker"),
      ],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  }
  return cachedHighlighter;
}

type Theme = { light: string; dark: string };

const DEFAULT_THEME: Theme = { light: "github-light", dark: "github-dark" };

const DEFAULT_MAX_LINES = 2000;

const DEFAULT_IGNORE: RegExp[] = [
  /\.min\.[a-z]+$/i,
  /\.lock$/i,
  /(^|\/)package-lock\.json$/i,
  /(^|\/)bun\.lock$/i,
  /(^|\/)yarn\.lock$/i,
  /(^|\/)pnpm-lock\.yaml$/i,
];

const EXT_TO_LANG: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  mts: "typescript",
  cts: "typescript",
  js: "javascript",
  jsx: "jsx",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  jsonc: "jsonc",
  css: "css",
  scss: "scss",
  sass: "sass",
  less: "less",
  html: "html",
  htm: "html",
  xml: "xml",
  svg: "xml",
  md: "markdown",
  yml: "yaml",
  yaml: "yaml",
  toml: "toml",
  py: "python",
  rb: "ruby",
  rs: "rust",
  go: "go",
  java: "java",
  php: "php",
  sh: "shellscript",
  bash: "shellscript",
  zsh: "shellscript",
  fish: "shellscript",
  sql: "sql",
  diff: "diff",
  patch: "diff",
  dockerfile: "docker",
};

function langFromFilename(name: string | undefined): string | null {
  if (!name) return null;
  const base = name.split("/").pop() ?? name;
  if (base.toLowerCase() === "dockerfile") return "dockerfile";
  const dot = base.lastIndexOf(".");
  if (dot < 0) return null;
  const ext = base.slice(dot + 1).toLowerCase();
  return EXT_TO_LANG[ext] ?? null;
}

function matchesIgnore(name: string | undefined, patterns: RegExp[]) {
  if (!name) return false;
  return patterns.some((p) => p.test(name));
}

function countLines(text: string | undefined): number {
  if (!text) return 0;
  let count = 1;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) === 10) count++;
  }
  return count;
}

function useTokens(
  code: string | undefined,
  lang: string | null,
  theme: Theme,
  enabled: boolean,
): ThemedToken[][] | null {
  const [tokens, setTokens] = useState<ThemedToken[][] | null>(null);
  useEffect(() => {
    if (!enabled || !lang || code === undefined) {
      setTokens(null);
      return;
    }
    let cancelled = false;
    getHighlighter()
      .then((highlighter) => {
        if (cancelled) return;
        if (!highlighter.getLoadedLanguages().includes(lang)) {
          setTokens(null);
          return;
        }
        const result = highlighter.codeToTokens(code, {
          lang,
          themes: { light: theme.light, dark: theme.dark },
          defaultColor: false,
        });
        setTokens(result.tokens);
      })
      .catch(() => {
        if (!cancelled) setTokens(null);
      });
    return () => {
      cancelled = true;
    };
  }, [code, lang, theme.light, theme.dark, enabled]);
  return tokens;
}

function TokenLine({ tokens }: { tokens: ThemedToken[] | undefined }) {
  if (!tokens) return null;
  return (
    <>
      {tokens.map((token, i) => (
        <span
          key={i}
          style={token.htmlStyle}
          className="text-(--shiki-light) dark:text-(--shiki-dark)"
        >
          {token.content}
        </span>
      ))}
    </>
  );
}

type DiffRichFileProps = {
  filename?: string;
  defaultOpen?: boolean;
  theme?: Theme;
  maxLines?: number;
  ignoreFilenames?: RegExp[];
  contextLines?: number;
} & (
  | { from: string; to: string; patch?: undefined }
  | { patch: string; from?: undefined; to?: undefined }
);

export function DiffRichFile({
  filename,
  defaultOpen = true,
  theme = DEFAULT_THEME,
  maxLines = DEFAULT_MAX_LINES,
  ignoreFilenames = DEFAULT_IGNORE,
  contextLines = 3,
  ...input
}: DiffRichFileProps) {
  const diff = useDiff(
    input.patch !== undefined
      ? { patch: input.patch, wordLevel: false, contextLines }
      : {
          from: input.from,
          to: input.to,
          wordLevel: false,
          contextLines,
        },
  );

  const name = filename ?? diff.name ?? "untitled";
  const lang = useMemo(() => langFromFilename(name), [name]);
  const ignored = useMemo(
    () => matchesIgnore(name, ignoreFilenames),
    [name, ignoreFilenames],
  );

  const tooBig =
    countLines(input.from) > maxLines ||
    countLines(input.to) > maxLines ||
    diff.lines.length > maxLines;

  const enabled =
    !ignored && !tooBig && lang !== null && input.patch === undefined;

  const oldTokens = useTokens(input.from, lang, theme, enabled);
  const newTokens = useTokens(input.to, lang, theme, enabled);

  return (
    <DiffFile defaultOpen={defaultOpen}>
      <DiffFileHeader>
        <DiffFileName>{name}</DiffFileName>
        <DiffStat kind="added">+{diff.additions}</DiffStat>
        <DiffStat kind="removed">-{diff.removals}</DiffStat>
      </DiffFileHeader>
      <DiffFilePanel>
        {diff.lines.map((entry) => {
          if (entry.state === "skip") return <DiffSkip key={entry.key} />;
          if (!enabled) return <DiffRow key={entry.key} entry={entry} />;
          const number =
            entry.state === "removed" ? entry.oldNumber : entry.newNumber;
          const tokens =
            entry.state === "removed"
              ? oldTokens?.[(entry.oldNumber ?? 1) - 1]
              : newTokens?.[(entry.newNumber ?? 1) - 1];
          return (
            <DiffLine key={entry.key} state={entry.state} number={number}>
              {tokens ? <TokenLine tokens={tokens} /> : entry.text}
            </DiffLine>
          );
        })}
      </DiffFilePanel>
    </DiffFile>
  );
}
