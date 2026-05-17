import fs from 'fs/promises';
import path from 'path';
import { log, spinner } from '@clack/prompts';
import picocolors from 'picocolors';
import type { Registry } from '../schemas/registry-schema';
import type { Item } from '../schemas/item-schema';
import { parseTokensCss } from './parse-tokens-css';

interface BuildShadcnOptions {
  output: string;
  tokensPath: string;
  homepage: string;
  initName?: string;
  baseDependencies?: string[];
}

const ITEM_SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json';
const REGISTRY_SCHEMA = 'https://ui.shadcn.com/schema/registry.json';

const DEFAULT_BASE_DEPS = [
  '@base-ui/react',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
];

export async function buildShadcnRegistry(
  registry: Registry,
  options: BuildShadcnOptions,
) {
  const s = spinner();
  s.start('Building shadcn registry...');

  const {
    output,
    tokensPath,
    homepage,
    initName = 'init',
    baseDependencies = DEFAULT_BASE_DEPS,
  } = options;

  try {
    await fs.mkdir(output, { recursive: true });

    s.message('Parsing token CSS...');
    const tokensSource = await fs.readFile(tokensPath, 'utf-8');
    const tokens = parseTokensCss(tokensSource);

    s.message(`Building ${initName}.json (base theme)...`);
    const initItem = buildInitItem(initName, tokens, baseDependencies);
    await writeJson(path.join(output, `${initName}.json`), initItem);

    const indexItems: Array<{ name: string; type: string }> = [
      { name: initName, type: initItem.type },
    ];

    for (let i = 0; i < registry.items.length; i++) {
      const item = registry.items[i];
      s.message(`Building ${item.name} (${i + 1}/${registry.items.length})`);
      const shadcnItem = await buildShadcnItem(item, {
        homepage,
        initName,
        outputDir: output,
      });
      await writeJson(path.join(output, `${item.name}.json`), shadcnItem);
      indexItems.push({ name: item.name, type: shadcnItem.type });
    }

    s.message('Building registry index...');
    await writeJson(path.join(output, 'registry.json'), {
      $schema: REGISTRY_SCHEMA,
      name: registry.name,
      homepage,
      items: indexItems,
    });

    s.stop('shadcn registry built');
    log.success(
      picocolors.green(
        `Built ${registry.items.length} component(s) + 1 base item (${initName})`,
      ),
    );
  } catch (error) {
    s.stop('shadcn registry build failed');
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    log.error(picocolors.red(message));
    throw error;
  }
}

function buildInitItem(
  name: string,
  tokens: ReturnType<typeof parseTokensCss>,
  dependencies: string[],
) {
  const item: Record<string, unknown> = {
    $schema: ITEM_SCHEMA,
    name,
    type: 'registry:style',
    dependencies,
    cssVars: pickCssVars(tokens.cssVars),
  };

  if (Object.keys(tokens.css).length > 0) {
    item.css = tokens.css;
  }

  return item;
}

function pickCssVars(vars: ReturnType<typeof parseTokensCss>['cssVars']) {
  const out: Record<string, Record<string, string>> = {};
  if (Object.keys(vars.theme).length > 0) out.theme = vars.theme;
  if (Object.keys(vars.light).length > 0) out.light = vars.light;
  if (Object.keys(vars.dark).length > 0) out.dark = vars.dark;
  return out;
}

interface BuildItemContext {
  homepage: string;
  initName: string;
  outputDir: string;
}

async function buildShadcnItem(item: Item, ctx: BuildItemContext) {
  const files = await Promise.all(
    item.files.map(async (file) => {
      if (!file.path) {
        throw new Error(`Path is required for file in item "${item.name}"`);
      }
      const raw = await fs.readFile(file.path, 'utf-8');
      const content = rewriteImports(raw).replace(/\r/g, '').trim();
      const sourcePath = `ai/${file.name}`;
      const target = `@components/ai/${file.name}`;
      return {
        path: sourcePath,
        type: 'registry:ui',
        target,
        content,
      };
    }),
  );

  const npmDeps = item.dependencies?.npm
    ? Object.entries(item.dependencies.npm).map(
        ([pkg, version]) => `${pkg}@${version}`,
      )
    : [];

  const itemDeps = item.dependencies?.items ?? [];
  const registryDeps = [
    itemUrl(ctx, ctx.initName),
    ...itemDeps.map((name) => itemUrl(ctx, name)),
  ];

  return {
    $schema: ITEM_SCHEMA,
    name: item.name,
    type: 'registry:ui',
    ...(npmDeps.length > 0 ? { dependencies: npmDeps } : {}),
    registryDependencies: registryDeps,
    files,
  };
}

function itemUrl(ctx: BuildItemContext, name: string): string {
  const base = ctx.homepage.replace(/\/$/, '');
  const dirSegment = ctx.outputDir
    .split(path.sep)
    .reverse();
  // Build the path segment relative to `public/`. e.g. ./public/shadcn/r → "shadcn/r"
  const pubIdx = dirSegment.indexOf('public');
  const segments =
    pubIdx >= 0
      ? dirSegment.slice(0, pubIdx).reverse()
      : [path.basename(ctx.outputDir)];
  return `${base}/${segments.join('/')}/${name}.json`;
}

function rewriteImports(content: string): string {
  return content.replace(
    /\bfrom\s+(['"`])(#\/[^'"`]+)\1/g,
    (_, quote, fullPath) => {
      const rewritten = `@/${fullPath.slice(2)}`;
      return `from ${quote}${rewritten}${quote}`;
    },
  );
}

async function writeJson(filepath: string, data: unknown) {
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}
