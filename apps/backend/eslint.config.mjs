import baseConfig from "@acme/eslint-config/base";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**","dist/**"],
  },
  ...baseConfig,
  {
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
];
