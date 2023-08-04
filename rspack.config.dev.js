// @ts-check
const configBase = require('./rspack.config')

/** @type {import('@rspack/cli').Configuration} */
const config = {
  ...configBase,
  mode: 'development',
  devServer: {
    hot: true,
    allowedHosts: ['.preview.csb.app'],
    port: '2023',
  },
}

module.exports = config
