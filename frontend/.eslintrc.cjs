module.exports = {
  root: true,
  env: {
    browser: true,
    es2023: true,
  },
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ["../.eslintrc.cjs", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  plugins: ["react"],
  settings: {
    react: {
      version: "detect",
      pragma: "React",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-types": "off",
  },
};
