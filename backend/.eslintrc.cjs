module.exports = {
  root: true,
  env: {
    node: true,
    es2023: true,
  },
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
  },
  extends: ["../.eslintrc.cjs"],
  plugins: ["import"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",

    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: ["./src/**/!(*.integration.test.ts)"],
            from: "./src/test/**/*",
            message: "You cannot import test files into main backend code!",
          },
        ],
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".ts", ".js"],
      },
    },
  },
  overrides: [
    {
      files: ["src/test/**/*.ts", "src/**/*.integration.test.ts"],
      rules: {
        "import/no-restricted-paths": "off",
      },
    },
  ],
};
