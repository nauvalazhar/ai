import ShikiHighlighter from "#/lib/shiki";

export function Syntax({
  children,
  language,
  showLineNumbers = false,
}: {
  children: string;
  language: string;
  showLineNumbers?: boolean;
}) {
  return (
    <ShikiHighlighter
      language={language}
      theme={{ light: "github-light", dark: "github-dark" }}
      defaultColor="light"
      addDefaultStyles={false}
      showLanguage={false}
      showLineNumbers={showLineNumbers}
      className="text-sm leading-relaxed font-mono rounded-md [&_pre]:bg-transparent! [&_pre]:outline-none!"
    >
      {children}
    </ShikiHighlighter>
  );
}
