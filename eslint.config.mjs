import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: [ "**/*.js" ],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: globals.browser,
    },
    rules: {
      "require-atomic-updates": "error",
      "no-invalid-this": "error",
      "no-useless-call": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "prefer-const": "error",
      "complexity": [ "error", 10 ],
      "max-depth": [ "error", 5 ],
      "no-eval": "error",
      "indent": [ "error", 2 ],
      "linebreak-style": [ "error", "unix" ],
      "quotes": [ "error", "double", { "avoidEscape": true } ],
      "semi": [ "error", "never" ],
      "yoda": [ "error", "always" ],
      "space-before-blocks": [ "error", "always" ],
      "space-in-parens": [ "error", "never" ],
      "no-trailing-spaces": "error",
      "padded-blocks": [ "error", "never" ],
      "eqeqeq": "error",
      "keyword-spacing": [ "error", { "before": true, "after": true } ],
    },
  },
  pluginJs.configs.recommended,
]
