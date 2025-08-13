module.exports = {
  root: true,
  env: {
    es2023: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
  },
  extends: ["../.eslintrc.cjs"],
  rules: {
    "no-unused-vars": "warn",
  },
};
