// @ts-check
const configBase = require('./rspack.config')

/** @type {import('@rspack/cli').Configuration} */
const config = {
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
}

module.exports = config
