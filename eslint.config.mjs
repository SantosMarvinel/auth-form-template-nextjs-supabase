import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import checkFile from "eslint-plugin-check-file";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    plugins: {
      "check-file": checkFile,
    },

    rules: {
      "prefer-arrow-callback": ["error"],
      "prefer-template": ["error"],
      semi: ["error"],
      quotes: ["error", "double"],
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{jsx,tsx}": "KEBAB_CASE",
          "**/*.{js,ts}": "KEBAB_CASE",
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "src/**/": "KEBAB_CASE",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/app/(**)",
  ]),
]);

export default eslintConfig;
