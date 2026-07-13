// @ts-check

import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  ...tseslint.configs.recommended,
  eslintPluginPrettier,
  globalIgnores([
    "dist/**",
    "node_modules/**",
    "grafana_data/**",
    "prometheus-data/**",
  ]),
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-empty-interface": "off",
    },
  },
]);
