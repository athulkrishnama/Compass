// @ts-check

import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  ...tseslint.configs.recommended,
  eslintPluginPrettier,
]
);