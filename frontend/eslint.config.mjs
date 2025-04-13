import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Example of custom rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-*": "off",
      semi: ["error", "always"], // Enforce semicolons at the end of statements
    },
  },
];

export default eslintConfig;
