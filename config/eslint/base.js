export default [
  {
    ignores: [
      ".next/**",
      "dist/**",
      "build/**",
      "node_modules/**"
    ]
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-no-target-blank": "off",
      "@next/next/no-img-element": "off"
    }
  }
];
