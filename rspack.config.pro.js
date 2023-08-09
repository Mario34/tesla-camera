// @ts-check
const { defineConfig } = require('@rspack/cli')
const configBase = require('./rspack.config')

module.exports = defineConfig({
  ...configBase,
  mode: 'production',
  devtool: false,
  builtins: {
    ...configBase.builtins,
    html: [
      {
        template: './index.html',
        filename: 'index.html',
        minify: true,
      },
    ],
  },
})
