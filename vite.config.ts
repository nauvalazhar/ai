import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

// Promotes fenced code-block meta (e.g. `title="src/utils.ts"`) onto the
// rendered <code> element as HTML props, so `PreBlock` can read them.
function remarkCodeMeta() {
  const attrRe = /(\w[\w-]*)=(?:"([^"]*)"|'([^']*)'|(\S+))/g
  function walk(node: any) {
    if (node?.type === 'code' && typeof node.meta === 'string') {
      const attrs: Record<string, string> = {}
      let m: RegExpExecArray | null
      attrRe.lastIndex = 0
      while ((m = attrRe.exec(node.meta)) !== null) {
        attrs[m[1]] = m[2] ?? m[3] ?? m[4] ?? ''
      }
      if (Object.keys(attrs).length > 0) {
        node.data ??= {}
        node.data.hProperties ??= {}
        Object.assign(node.data.hProperties, attrs)
      }
    }
    if (Array.isArray(node?.children)) {
      for (const child of node.children) walk(child)
    }
  }
  return (tree: unknown) => walk(tree)
}

const mdxPlugin = mdx({
  providerImportSource: '@mdx-js/react',
  remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkCodeMeta],
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
