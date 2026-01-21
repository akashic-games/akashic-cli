import typescriptEslint from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import stylisticTs from "@stylistic/eslint-plugin-ts";

export default [
  {
    ignores: ["**/*.js"],
  },
  importPlugin.flatConfigs.recommended,
  {
    files: ["src/**/*.ts"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "@stylistic/ts": stylisticTs
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 6,
      sourceType: "module",

      parserOptions: {
        project: ["tsconfig.json", "tsconfig.jest.json"],
      },
    },

    rules: {
      "@stylistic/ts/quotes": ["error", "double"],
      "@stylistic/ts/semi": ["error"],
      "@stylistic/ts/type-annotation-spacing": ["error"],
      "@stylistic/ts/member-delimiter-style": ["error", {
        multiline: {
          delimiter: "semi",
          requireLast: true,
        },
        singleline: {
          delimiter: "semi",
          requireLast: false,
        },
        overrides: {
          interface: {
            singleline: {
              delimiter: "semi",
              requireLast: true,
            },

            multiline: {
              delimiter: "semi",
              requireLast: true,
            },
          },
        },
      }],
      "@stylistic/ts/indent": ["error", "tab", {
        FunctionDeclaration: {
          parameters: "first",
        },
        FunctionExpression: {
          parameters: "first",
        },
        SwitchCase: 1,
        flatTernaryExpressions: true,
        ignoredNodes: ["ConditionalExpression"],
      }],
      "@typescript-eslint/naming-convention": ["error", {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE"],

        filter: {
          regex: "^_",
          match: false,
        },
      }, {
          selector: "typeLike",
          format: ["PascalCase"],
        }],
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/member-ordering": ["error", {
        default: [
          "public-static-field",
          "public-instance-field",
          "private-instance-field",
          "public-static-method",
          "public-constructor",
          "public-instance-method",
          "private-instance-method",
        ],
      }],
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/parameter-properties": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/typedef": ["error", {
        propertyDeclaration: true,
        memberVariableDeclaration: true,
        parameter: true,
        arrowParameter: false,
      }],
      "@typescript-eslint/explicit-function-return-type": ["error", {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      "@typescript-eslint/no-unused-vars": ["error", {
        vars: "all",
        args: "none",
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }],
      camelcase: "off",
      curly: "off",
      "dot-notation": "error",
      "eol-last": "error",
      eqeqeq: ["error", "smart"],
      "guard-for-in": "error",
      "id-blacklist": "off",
      "id-match": "off",
      "max-len": ["error", {
        code: 140,
      }],
      "no-bitwise": "off",
      "no-caller": "error",
      "no-console": ["error", {
        allow: [
          "log",
          "warn",
          "dir",
          "timeLog",
          "assert",
          "clear",
          "count",
          "countReset",
          "group",
          "groupEnd",
          "table",
          "dirxml",
          "error",
          "groupCollapsed",
          "Console",
          "profile",
          "profileEnd",
          "timeStamp",
          "context",
        ],
      }],
      "no-debugger": "error",
      "no-empty": "error",
      "no-eval": "error",
      "no-fallthrough": "error",
      "no-new-wrappers": "error",
      "no-redeclare": "off",
      "no-trailing-spaces": "error",
      "comma-spacing": "error",
      "brace-style": "error",
      "no-underscore-dangle": "off",
      "no-unused-vars": "off",
      "no-unused-expressions": "error",
      "no-unused-labels": "error",
      radix: "error",
      "spaced-comment": ["error", "always", {
        markers: ["/"],
      }],
      "keyword-spacing": ["error"],
      "import/order": ["error", {
        alphabetize: {
          order: "asc",
          caseInsensitive: true
        }
      }],
      "import/no-unresolved": "off"
    }
  }
];
