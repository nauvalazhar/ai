export const CLI_NAME = 'ai-kit';
export const CONFIG_FILE = 'aikit.json';
export const REGISTRY_SOURCE_KEY = 'aikit';

export const DEFAULT_REGISTRY_URL =
  process.env.AI_KIT_REGISTRY ?? 'https://ai.nauv.al/registry';

export const DEFAULT_REGISTRY_URL_DEV =
  process.env.AI_KIT_REGISTRY ?? 'http://localhost:3300/registry';
