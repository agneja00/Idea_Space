module.exports = {
  root: true,
  env: {
    es2023: true,
    node: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:jest/recommended"],
  rules: {
    "no-console": "warn",
    semi: ["error", "always"],
    quotes: ["error", "double"],
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      plugins: ["@typescript-eslint", "jest"],
      rules: {},
    },
  ],
};
