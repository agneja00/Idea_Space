module.exports = {
  root: true,
  env: {
    es2023: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
  },
  extends: [
    '../.eslintrc.cjs',
  ],
  rules: {
    'no-console': 'off',
  },
};
