type Decls = Record<string, string>;

export interface ParsedTokens {
  cssVars: {
    theme: Decls;
    light: Decls;
    dark: Decls;
  };
  css: Record<string, Record<string, Decls>>;
}

export function parseTokensCss(input: string): ParsedTokens {
  const result: ParsedTokens = {
    cssVars: { theme: {}, light: {}, dark: {} },
    css: {},
  };

  // Strip /* ... */ comments
  const source = input.replace(/\/\*[\s\S]*?\*\//g, '');

  let i = 0;
  while (i < source.length) {
    while (i < source.length && /\s/.test(source[i])) i++;
    if (i >= source.length) break;

    const selectorStart = i;
    while (i < source.length && source[i] !== '{') i++;
    if (i >= source.length) break;

    const selector = source.slice(selectorStart, i).trim();
    i++; // consume {

    const blockStart = i;
    let depth = 1;
    while (i < source.length && depth > 0) {
      if (source[i] === '{') depth++;
      else if (source[i] === '}') depth--;
      if (depth > 0) i++;
    }
    const block = source.slice(blockStart, i);
    i++; // consume }

    if (selector === ':root') {
      Object.assign(result.cssVars.light, parseDecls(block));
    } else if (selector === '.dark') {
      Object.assign(result.cssVars.dark, parseDecls(block));
    } else if (selector === '@theme' || selector.startsWith('@theme ')) {
      Object.assign(result.cssVars.theme, parseDecls(block));
    } else if (selector.startsWith('@keyframes ')) {
      result.css[selector] = parseKeyframeBlock(block);
    }
  }

  return result;
}

function parseDecls(block: string): Decls {
  const out: Decls = {};
  const declRegex = /--([a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m: RegExpExecArray | null;
  while ((m = declRegex.exec(block)) !== null) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

function parseKeyframeBlock(block: string): Record<string, Decls> {
  const out: Record<string, Decls> = {};
  let i = 0;
  while (i < block.length) {
    while (i < block.length && /\s/.test(block[i])) i++;
    if (i >= block.length) break;

    const stopStart = i;
    while (i < block.length && block[i] !== '{') i++;
    if (i >= block.length) break;
    const stop = block
      .slice(stopStart, i)
      .replace(/\s+/g, ' ')
      .trim();
    i++; // consume {

    const declStart = i;
    let depth = 1;
    while (i < block.length && depth > 0) {
      if (block[i] === '{') depth++;
      else if (block[i] === '}') depth--;
      if (depth > 0) i++;
    }
    const declsText = block.slice(declStart, i);
    i++; // consume }

    const decls: Decls = {};
    const declRegex = /([a-z-]+)\s*:\s*([^;]+);/gi;
    let m: RegExpExecArray | null;
    while ((m = declRegex.exec(declsText)) !== null) {
      decls[m[1]] = m[2].trim();
    }

    if (Object.keys(decls).length > 0) out[stop] = decls;
  }
  return out;
}
