// @ts-check
const { defineConfig } = require('@rspack/cli')
const configBase = require('./rspack.config')

module.exports = defineConfig({
  ...configBase,
  mode: 'development',
  output: {
    publicPath: '/',
  },
  devServer: {
    hot: true,
    port: '2023',
  },
  builtins: {
    ...configBase.builtins,
    react: {
      development: true,
      refresh: true,
    },
  },
})
