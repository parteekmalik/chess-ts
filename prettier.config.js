/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
import { resolveConfig } from "prettier";

const defaultConfig = await resolveConfig(process.cwd());

const config = {
  ...defaultConfig,
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 150,
};

export default config;