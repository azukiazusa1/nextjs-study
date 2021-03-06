module.exports = {
  plugins: ["simple-import-sort", "unused-imports", "jsx-a11y"],
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:jsx-a11y/recommended",
    "prettier",
  ],
  rules: {
    "react/self-closing-comp": [
      "error",
      {
        component: true,
        html: true,
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "unused-imports/no-unused-imports": "error",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
  },
};
