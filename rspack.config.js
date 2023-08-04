// @ts-check

/** @type {import('@rspack/cli').Configuration} */
const config = {
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
}

module.exports = config
