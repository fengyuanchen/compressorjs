module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-object-assign',
  ],
  env: {
    test: {
      plugins: [
        'istanbul',
      ],
    },
  },
};
