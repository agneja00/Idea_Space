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
    'eslint:recommended',
  ],
  rules: {
    'no-console': 'warn',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      plugins: ['@typescript-eslint'],
      rules: {},
    },
  ],
};
