#!/usr/bin/env node
import { program } from 'commander';
import { addCommand } from '~/commands/add';
import { initCommand } from '~/commands/init';
import { buildCommand } from '~/commands/build';
import { docsCommand } from '~/commands/docs';

program
  .name('ai-kit')
  .description('CLI for the ai-kit component registry')
  .version('0.0.1');

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(buildCommand);
program.addCommand(docsCommand);

program.parse();
