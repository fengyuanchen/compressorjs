const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const pkg = require('./package');

const now = new Date();

module.exports = {
  entry: 'src/index.js',
  targets: [
    {
      dest: 'dist/image-compressor.js',
    },
    {
      dest: 'dist/image-compressor.common.js',
      format: 'cjs',
    },
    {
      dest: 'dist/image-compressor.esm.js',
      format: 'es',
    },
    {
      dest: 'docs/js/image-compressor.js',
    },
  ],
  format: 'umd',
  moduleName: 'ImageCompressor',
  plugins: [
    commonjs(),
    nodeResolve({
      jsnext: true,
    }),
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
