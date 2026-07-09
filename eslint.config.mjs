import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = [
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
