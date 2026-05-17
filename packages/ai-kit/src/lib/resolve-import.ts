import { Config } from '../schemas/config-schema';
import path from 'path';

const IMPORT_REGEX = /\bfrom\s+(['"`])(#[^'"`]+)\1/g;

export function resolveImportAlias(content: string, config: Config): string {
  const keys = Object.keys(config.imports).sort(
    (a, b) => b.length - a.length,
  );

  return content.replace(IMPORT_REGEX, (match, quote, fullPath) => {
    // Strip leading `#` and optional `/` — supports both `#key/...` and `#/key/...`
    const stripped = fullPath.slice(1).replace(/^\//, '');

    for (const key of keys) {
      if (stripped === key || stripped.startsWith(`${key}/`)) {
        const target = config.imports[key];
        const rest = stripped.slice(key.length);
        return `from ${quote}${target}${rest}${quote}`;
      }
    }

    return match;
  });
}

export function resolveTargetPath(
  target: string,
  config: Config,
  cwd: string = process.cwd(),
): string {
  const configPath = config.paths[target as keyof typeof config.paths];

  if (!configPath) {
    throw new Error(
      `Unknown target "${target}". Available targets: ${Object.keys(config.paths).join(', ')}`,
    );
  }

  return path.join(cwd, configPath);
}
