import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-script-url": "error",
      "no-new-func": "error",
      "security/detect-object-injection": "warn",
      "security/detect-eval-with-expression": "error",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-possible-timing-attacks": "warn"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
