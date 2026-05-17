import { Config } from '../schemas/config-schema';

export const defaultConfig = {
  framework: 'react',
  paths: {
    components: 'components/ai',
    utils: 'lib/utils.ts',
  },
  imports: {
    'components/ai': '@/components/ai',
    lib: '@/lib',
  },
} satisfies Config;
