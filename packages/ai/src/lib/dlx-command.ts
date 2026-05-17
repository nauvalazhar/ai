import { detectPackageManager, PackageManager } from './package-manager';
import { PACKAGE_NAME } from './constants';

const DLX_PREFIX: Record<PackageManager, string> = {
  bun: 'bunx',
  npm: 'npx',
  pnpm: 'pnpm dlx',
  yarn: 'yarn dlx',
};

export async function dlxCommand(
  args: string,
  cwd: string = process.cwd(),
): Promise<string> {
  const pm = await detectPackageManager(cwd);
  return `${DLX_PREFIX[pm]} ${PACKAGE_NAME} ${args}`;
}
