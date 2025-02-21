import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import _import from "eslint-plugin-import";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["*", "!src", "!test", "!demo/*.jsx"],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
)), {
    plugins: {
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.jest,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },

        "import/resolver": {
            node: {
                extensions: [".mjs", ".js", ".json"],
            },

            webpack: {
                config: {
                    resolve: {
                        extensions: [".js", ".jsx"],
                    },
                },
            },
        },

        "import/extensions": [".js", ".mjs", ".jsx", ".json"],
    },

    rules: {
        "accessor-pairs": "error",
        "arrow-body-style": "error",
        "import/default": "error",

        "import/dynamic-import-chunkname": ["error", {
            importFunctions: [],
            webpackChunknameFormat: "[0-9a-zA-Z-_/.]+",
        }],

        "import/export": "error",

        "import/extensions": ["error", "never", {
            json: true,
        }],

        "import/first": "error",
        "import/imports-first": "error",

        "import/max-dependencies": ["error", {
            max: 10,
        }],

        "import/named": "error",
        "import/namespace": "error",
        "import/newline-after-import": "error",
        "import/no-absolute-path": "error",
        "import/no-amd": "error",

        "import/no-anonymous-default-export": ["error", {
            allowArray: false,
            allowArrowFunction: false,
            allowAnonymousClass: false,
            allowAnonymousFunction: false,
            allowLiteral: false,
            allowObject: false,
        }],

        "import/no-commonjs": "error",

        "import/no-cycle": ["error", {
            maxDepth: "∞",
        }],

        "import/no-default-export": "error",
        "import/no-deprecated": "error",
        "import/no-duplicates": "error",
        "import/no-dynamic-require": "error",

        "import/no-extraneous-dependencies": ["error", {
            devDependencies: [
                "test/**",
                "tests/**",
                "spec/**",
                "**/__tests__/**",
                "**/__mocks__/**",
                "test.{js,jsx}",
                "test-*.{js,jsx}",
                "**/*{.,_}{test,spec}.{js,jsx}",
                "**/jest.config.js",
                "**/jest.setup.js",
                "**/vue.config.js",
                "**/webpack.config.js",
                "**/webpack.config.*.js",
                "**/rollup.config.js",
                "**/rollup.config.*.js",
                "**/gulpfile.js",
                "**/gulpfile.*.js",
                "**/Gruntfile{,.js}",
                "**/protractor.conf.js",
                "**/protractor.conf.*.js",
                "**/karma.conf.js",
            ],

            optionalDependencies: false,
        }],

        "import/no-mutable-exports": "error",
        "import/no-named-as-default-member": "error",
        "import/no-named-as-default": "error",
        "import/no-named-default": "error",
        "import/no-namespace": "error",
        "import/no-nodejs-modules": "error",
        "import/no-restricted-paths": "error",
        "import/no-self-import": "error",
        "import/no-unassigned-import": "error",

        "import/no-unresolved": ["error", {
            commonjs: true,
            caseSensitive: true,
        }],

        "import/no-useless-path-segments": ["error", {
            commonjs: true,
        }],

        "import/no-webpack-loader-syntax": "error",

        "import/order": ["error", {
            "newlines-between": "always-and-inside-groups",
            groups: ["builtin", "external", "parent", "sibling", "index"],
        }],

        "import/unambiguous": "error",
        "no-console": "error",

        "no-else-return": ["error", {
            allowElseIf: false,
        }],

        "no-plusplus": "error",
        "no-unused-expressions": "error",

        "no-unused-vars": ["error", {
            ignoreRestSiblings: true,
        }],

        "no-var": "error",

        "padding-line-between-statements": ["error", {
            blankLine: "always",
            prev: "*",
            next: "return",
        }, {
            blankLine: "always",
            prev: ["const", "let", "var", "directive", "if", "break"],
            next: "*",
        }, {
            blankLine: "any",
            prev: ["const", "let", "var"],
            next: ["const", "let", "var"],
        }, {
            blankLine: "any",
            prev: "directive",
            next: "directive",
        }],

        "prefer-const": "error",
        "prefer-template": "error",
        "quote-props": "off",
        quotes: "off",
        "react/no-unused-prop-types": "error",
    },
}];