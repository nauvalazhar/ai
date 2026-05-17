import { Command } from 'commander';
import { intro, outro, log } from '@clack/prompts';
import fs from 'fs/promises';
import path from 'path';
import picocolors from 'picocolors';
import { RegistrySchema } from '../schemas/registry-schema';
import { isRegistryExists } from '~/lib/utils';
import { cleanBuild } from '~/lib/clean-build';
import { buildRegistry } from '../lib/build-registry';
import { buildShadcnRegistry } from '../lib/build-shadcn-registry';

export const buildCommand = new Command()
  .name('build')
  .description('Build the registry')
  .option('-o, --output <path>', 'Output directory', './public/registry')
  .option(
    '--shadcn-output <path>',
    'Output directory for the shadcn-compatible registry',
    './public/shadcn/r',
  )
  .option(
    '--tokens <path>',
    'Path to the token CSS source for the shadcn base item',
    './src/styles/tokens.css',
  )
  .option('--no-shadcn', 'Skip building the shadcn-compatible registry')
  .action(async (options) => {
    console.log();
    intro(picocolors.bgBlue(picocolors.blackBright(' Build Registry ')));

    log.warn(
      picocolors.yellow('This feature is not yet available for public use.'),
    );

    try {
      // Check if registry exists
      if (!(await isRegistryExists())) {
        log.error(picocolors.red('Registry file not found: registry.json'));
        console.log();
        process.exit(1);
      }

      // Read and parse registry
      const registryContent = await fs.readFile('./registry.json', 'utf-8');
      const parsedRegistry = JSON.parse(registryContent);

      // Validate registry
      const validatedRegistry = RegistrySchema.safeParse(parsedRegistry);

      if (!validatedRegistry.success) {
        console.log(validatedRegistry.error);
        log.error(picocolors.red('Invalid registry format:'));
        validatedRegistry.error.issues.forEach((err) => {
          log.error(
            picocolors.red(`  - ${err.path.join('.')}: ${err.message}`),
          );
        });
        process.exit(1);
      }

      // Clean output directory
      await cleanBuild(options.output);

      // Build registry
      await buildRegistry(validatedRegistry.data, {
        output: options.output,
      });

      // Build shadcn-compatible registry alongside
      if (options.shadcn !== false) {
        const homepage = validatedRegistry.data.homepage;
        if (!homepage) {
          log.warn(
            picocolors.yellow(
              'Skipping shadcn registry: registry.json is missing "homepage" (required for resolvable item URLs).',
            ),
          );
        } else {
          await cleanBuild(options.shadcnOutput);
          await buildShadcnRegistry(validatedRegistry.data, {
            output: options.shadcnOutput,
            tokensPath: path.resolve(options.tokens),
            homepage,
          });
        }
      }

      outro(picocolors.green('Registry built successfully! ✓'));
    } catch (error) {
      log.error(
        picocolors.red(
          error instanceof Error ? error.message : 'An unknown error occurred',
        ),
      );
      process.exit(1);
    }
  });
