import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'

const env = loadEnv()

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
    alias: {
      '@common': './src/common',
    },
  },
  output: {
    assetPrefix: env.parsed.PUBLIC_ASSET_PREFIX,
    copy: [{ from: './public' }],
  },
  html: {
    template: './index.html',
  },
  server: {
    port: 6680,
  },
})
