module.exports = {
  '{src,test}/**/*.js|*.conf*.js': 'eslint --fix',
  '{src,docs}/**/*.{css,scss,html}': 'stylelint --fix',
};
