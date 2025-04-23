import baseConfig from "@acme/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  {
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off", // Disable the non-null assertion rule
    },
  },
];
