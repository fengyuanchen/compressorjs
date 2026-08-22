module.exports = {
  root: true,
  extends: 'airbnb-base',
  env: {
    browser: true,
  },
  plugins: [
    'import',
  ],
  rules: {
    'no-param-reassign': 'off',
    'sort-imports': ['error', {
      ignoreDeclarationSort: true,
    }],
    'valid-jsdoc': ['error', {
      requireReturn: false,
    }],
  },
  overrides: [
    {
      files: 'test/**/*.spec.js',
      env: {
        mocha: true,
      },
      globals: {
        Compressor: true,
        expect: true,
      },
      rules: {
        'no-new': 'off',
        'no-unused-expressions': 'off',
      },
    },
  ],
};
