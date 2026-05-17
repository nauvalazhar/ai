import fs from 'fs/promises';
import path from 'path';
import {
  CONFIG_FILE,
  DEFAULT_REGISTRY_URL,
  DEFAULT_REGISTRY_URL_DEV,
  REGISTRY_SOURCE_KEY,
} from './constants';

export interface ResolveRegistryResult {
  runtimeUrl: string;
  persist: boolean;
  existingConfig: any | null;
}

export async function resolveRegistry(
  cwd: string,
  cliRegistry?: string,
): Promise<ResolveRegistryResult> {
  const configPath = path.join(cwd, CONFIG_FILE);

  let existingConfig: any = null;
  try {
    existingConfig = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  } catch {}

  const isDev =
    process.env.AI_DEV === '1' || process.env.NODE_ENV === 'development';

  const defaultRegistry = isDev
    ? DEFAULT_REGISTRY_URL_DEV
    : DEFAULT_REGISTRY_URL;

  const runtimeUrl =
    cliRegistry ||
    existingConfig?.registries?.sources?.[REGISTRY_SOURCE_KEY]?.url ||
    defaultRegistry;

  const persist =
    Boolean(cliRegistry) &&
    !existingConfig?.registries?.sources?.[REGISTRY_SOURCE_KEY];

  return {
    runtimeUrl,
    persist,
    existingConfig,
  };
}
