module.exports = {
  '{src,test}/**/*.js|*.conf*.js': 'vue-cli-service lint',
  '{src,docs}/**/*.{css,scss,html}': 'stylelint --fix',
};
