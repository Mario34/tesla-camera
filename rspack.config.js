// @ts-check
const { defineConfig } = require('@rspack/cli')

module.exports = defineConfig({
  entry: {
    main: {
      import: ['./src/main.tsx'],
    },
  },
  output: {
    publicPath: './',
    filename: '[name].[contenthash].js',
  },
  builtins: {
    html: [
      {
        template: './index.html',
      },
    ],
    copy: {
      patterns: [
        {
          from: 'public',
        },
      ],
    },
  },
})
