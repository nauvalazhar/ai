import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const mdxPlugin = mdx({
  providerImportSource: '@mdx-js/react',
  remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
})

const originalTransform = mdxPlugin.transform as Function
// Don't transform ?raw / ?url / etc. — those should hit Vite's built-in
// asset handlers and return the file's raw text, not compiled MDX.
mdxPlugin.transform = function (this: unknown, code: string, id: string) {
  if (id.includes('?')) return null
  return originalTransform.call(this, code, id)
} as typeof mdxPlugin.transform

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      preset: 'cloudflare_module',
      compatibilityDate: '2024-09-19',
      cloudflare: {
        deployConfig: true,
        nodeCompat: true,
      },
      rollupConfig: { external: [/^@sentry\//] },
    }),
    tailwindcss(),
    { enforce: 'pre', ...mdxPlugin },
    tanstackStart(),
    viteReact({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
})

export default config
