module.exports = {
  mode: 'development',
  entry: {
    main: {
      import: ['./src/main.tsx'],
    },
  },
  output: {
    publicPath: '/',
  },
  devServer: {
    hot: true,
    allowedHosts: ['.preview.csb.app'],
    port: '9090',
  },
  module: {
    parser: {
      asset: {
        dataUrlCondition: {
          maxSize: 1,
        },
      },
    },
  },
  builtins: {
    html: [
      {
        template: './index.html',
      },
    ],
    progress: {},
    react: {
      development: true,
      refresh: true,
    },
  },
}
