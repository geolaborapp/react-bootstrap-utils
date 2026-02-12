'use strict';

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = [
  {
    entry: './src/index.js',
    externals: {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react',
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom',
      },
    },
    output: {
      library: 'ReactBootstrapUtils',
      libraryTarget: 'umd',
      globalObject: 'this',
    },
  },
  {
    entry: './demo/demo.jsx',
    output: {
      filename: 'demo.js',
      path: `${__dirname}/demo`,
      publicPath: '/demo/',
    },
    devServer: {
      static: {
        directory: `${__dirname}/demo`,
      },
      hot: true,
      port: 8080,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    plugins: [new ReactRefreshWebpackPlugin()],
  },
  {
    entry: './docs/docs.jsx',
    output: {
      path: `${__dirname}/docs`,
      filename: 'scripts.js',
    },
  },
].map((setup) => ({
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  ...setup,
}));
