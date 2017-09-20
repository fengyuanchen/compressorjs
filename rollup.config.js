const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const pkg = require('./package');

const now = new Date();

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/image-compressor.js',
      format: 'umd',
    },
    {
      file: 'dist/image-compressor.common.js',
      format: 'cjs',
    },
    {
      file: 'dist/image-compressor.esm.js',
      format: 'es',
    },
    {
      file: 'docs/js/image-compressor.js',
      format: 'umd',
    },
  ],
  name: 'ImageCompressor',
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  banner: `/*!
 * Image Compressor v${pkg.version}
 * https://github.com/${pkg.repository}
 *
 * Copyright (c) ${now.getFullYear()} Xkeshi
 * Released under the ${pkg.license} license
 *
 * Date: ${now.toISOString()}
 */
`,
};
