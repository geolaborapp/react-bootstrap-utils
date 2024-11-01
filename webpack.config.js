'use strict';

const path = require('path');

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
    mode: 'development',
    devtool: 'eval-source-map',
    entry: './demo/demo.jsx',
    output: {
      path: path.join(__dirname, 'demo'),
      filename: 'demo.js',
    },
    devServer: {
      static: path.join(__dirname, 'demo'),
      hot: true,
    },
  },
].map((setup) => ({
  ...setup,
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
}));
