/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable import/no-default-export */
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');

module.exports = {
  input: 'src/index.js',
  plugins: [
    resolve({
      extensions: ['.mjs', '.js', '.json', '.jsx'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      exclude: /node_modules/,
      extensions: ['.js', '.jsx'],
      presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }]],
    }),
  ],
  output: {
    file: 'dist/main.js',
    format: 'es',
  },
  external: [/@babel\/runtime/, 'react', 'prop-types', 'react-modal', 'react-dom', 'js-var-type'],
};
