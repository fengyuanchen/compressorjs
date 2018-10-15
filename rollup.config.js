const babel = require('rollup-plugin-babel');
const changeCase = require('change-case');
const commonjs = require('rollup-plugin-commonjs');
const createBanner = require('create-banner');
const nodeResolve = require('rollup-plugin-node-resolve');
const postprocess = require('rollup-plugin-postprocess');
const pkg = require('./package');

pkg.name = pkg.name.replace('js', '');

const name = changeCase.pascalCase(pkg.name);
const banner = createBanner({
  data: {
    name: `${name}.js`,
    year: '2018-present',
  },
});

module.exports = {
  input: 'src/index.js',
  output: [
    {
      banner,
      name,
      file: `dist/${pkg.name}.js`,
      format: 'umd',
    },
    {
      banner,
      file: `dist/${pkg.name}.common.js`,
      format: 'cjs',
    },
    {
      banner,
      file: `dist/${pkg.name}.esm.js`,
      format: 'esm',
    },
    {
      banner,
      name,
      file: `docs/js/${pkg.name}.js`,
      format: 'umd',
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    babel(),
    postprocess([
      [
        /var canvasToBlob = createCommonjsModule\(function \(module\) \{/,
        `var canvasToBlob = createCommonjsModule(function (module) {
    if (typeof window === 'undefined') {
      return;
    }`,
      ],
    ]),
  ],
};
