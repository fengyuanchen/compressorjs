const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const pkg = require('./package');

const now = new Date();
const banner = `/*!
 * Image Compressor v${pkg.version}
 * https://github.com/${pkg.repository}
 *
 * Copyright (c) 2017-${now.getFullYear()} Xkeshi
 * Released under the ${pkg.license} license
 *
 * Date: ${now.toISOString()}
 */
`;

module.exports = {
  input: 'src/index.js',
  output: [
    {
      banner,
      file: 'dist/image-compressor.js',
      format: 'umd',
      name: 'ImageCompressor',
    },
    {
      banner,
      file: 'dist/image-compressor.common.js',
      format: 'cjs',
    },
    {
      banner,
      file: 'dist/image-compressor.esm.js',
      format: 'es',
    },
    {
      banner,
      file: 'docs/js/image-compressor.js',
      format: 'umd',
      name: 'ImageCompressor',
    },
  ],
  plugins: [
    nodeResolve(),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
    }),
    commonjs(),
  ],
};
