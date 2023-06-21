"use strict";

const nodeRecommendedConfig = require("eslint-plugin-n/configs/recommended-script");
const js = require("@eslint/js");
const jsdoc = require("eslint-plugin-jsdoc");
const eslintComments = require("eslint-plugin-eslint-comments");
const unicorn = require("eslint-plugin-unicorn");

/*
 * the plugins' configs are not updated to support the flat config,
 * need to manually update the `plugins` property
 */
jsdoc.configs.recommended.plugins = { jsdoc };
eslintComments.configs.recommended.plugins = { "eslint-comments": eslintComments };

// extends eslint-plugin-n's recommended config
const nodeConfigs = [nodeRecommendedConfig, {
    rules: {
        "n/callback-return": ["error", ["cb", "callback", "next"]],
        "n/handle-callback-err": ["error", "err"],
        "n/no-deprecated-api": "error",
        "n/no-mixed-requires": "error",
        "n/no-new-require": "error",
        "n/no-path-concat": "error"
    }
}];

// extends eslint recommended config
const jsConfigs = [js.configs.recommended, {
    rules: {
        "array-bracket-spacing": "error",
        "array-callback-return": "error",
        "arrow-body-style": ["error", "as-needed"],
        "arrow-parens": ["error", "as-needed"],
        "arrow-spacing": "error",
        indent: ["error", 4, { SwitchCase: 1 }],
        "block-spacing": "error",
        "brace-style": ["error", "1tbs"],
        camelcase: "error",
        "class-methods-use-this": "error",
        "comma-dangle": "error",
        "comma-spacing": "error",
        "comma-style": ["error", "last"],
        "computed-property-spacing": "error",
        "consistent-return": "error",
        curly: ["error", "all"],
        "default-case": "error",
        "default-case-last": "error",
        "default-param-last": "error",
        "dot-location": ["error", "property"],
        "dot-notation": [
            "error",
            { allowKeywords: true }
        ],
        "eol-last": "error",
        eqeqeq: "error",
        "func-call-spacing": "error",
        "func-style": ["error", "declaration"],
        "function-call-argument-newline": ["error", "consistent"],
        "function-paren-newline": ["error", "consistent"],
        "generator-star-spacing": "error",
        "grouped-accessor-pairs": "error",
        "guard-for-in": "error",
        "key-spacing": ["error", { beforeColon: false, afterColon: true }],
        "keyword-spacing": "error",
        "lines-around-comment": ["error",
            {
                beforeBlockComment: true,
                afterBlockComment: false,
                beforeLineComment: true,
                afterLineComment: false
            }
        ],
        "max-len": ["error", 160,
            {
                ignoreComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true
            }
        ],
        "max-statements-per-line": "error",
        "new-cap": "error",
        "new-parens": "error",
        "no-alert": "error",
        "no-array-constructor": "error",
        "no-caller": "error",
        "no-confusing-arrow": "error",
        "no-console": "error",
        "no-constant-binary-expression": "error",
        "no-constructor-return": "error",
        "no-else-return": ["error", { allowElseIf: false }
        ],
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-floating-decimal": "error",
        "no-implied-eval": "error",
        "no-invalid-this": "error",
        "no-iterator": "error",
        "no-label-var": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-loop-func": "error",
        "no-mixed-spaces-and-tabs": ["error", false],
        "no-multi-spaces": "error",
        "no-multi-str": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                max: 2,
                maxBOF: 0,
                maxEOF: 0
            }
        ],
        "no-nested-ternary": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-object": "error",
        "no-new-wrappers": "error",
        "no-octal-escape": "error",
        "no-param-reassign": "error",
        "no-proto": "error",
        "no-process-exit": "off",
        "no-restricted-properties": ["error",
            {
                property: "substring",
                message: "Use .slice instead of .substring."
            },
            {
                property: "substr",
                message: "Use .slice instead of .substr."
            },
            {
                object: "assert",
                property: "equal",
                message: "Use assert.strictEqual instead of assert.equal."
            },
            {
                object: "assert",
                property: "notEqual",
                message: "Use assert.notStrictEqual instead of assert.notEqual."
            },
            {
                object: "assert",
                property: "deepEqual",
                message: "Use assert.deepStrictEqual instead of assert.deepEqual."
            },
            {
                object: "assert",
                property: "notDeepEqual",
                message: "Use assert.notDeepStrictEqual instead of assert.notDeepEqual."
            }
        ],
        "no-return-assign": "error",
        "no-script-url": "error",
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-shadow": "error",
        "no-tabs": "error",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef": ["error", { typeof: true }],
        "no-undef-init": "error",
        "no-undefined": "error",
        "no-underscore-dangle": ["error", { allowAfterThis: true }
        ],
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": "error",
        "no-unreachable-loop": "error",
        "no-unused-expressions": "error",
        "no-unused-vars": ["error", {
            vars: "all",
            args: "after-used",
            caughtErrors: "all"
        }
        ],
        "no-use-before-define": "error",
        "no-useless-call": "error",
        "no-useless-computed-key": "error",
        "no-useless-concat": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-whitespace-before-property": "error",
        "no-var": "error",
        "object-curly-newline": ["error",
            {
                consistent: true,
                multiline: true
            }
        ],
        "object-curly-spacing": ["error", "always"],
        "object-property-newline": ["error",
            {
                allowAllPropertiesOnSameLine: true
            }
        ],
        "object-shorthand": ["error",
            "always",
            {
                avoidExplicitReturnArrows: true
            }
        ],
        "one-var-declaration-per-line": "error",
        "operator-assignment": "error",
        "operator-linebreak": "error",
        "padding-line-between-statements": ["error",
            {
                blankLine: "always",
                prev: ["const", "let", "var"],
                next: "*"
            },
            {
                blankLine: "any",
                prev: ["const", "let", "var"],
                next: ["const", "let", "var"]
            }
        ],
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-exponentiation-operator": "error",
        "prefer-numeric-literals": "error",
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        quotes: ["error", "double", { avoidEscape: true }],
        "quote-props": ["error", "as-needed"],
        radix: "error",
        "require-unicode-regexp": "error",
        "rest-spread-spacing": "error",
        semi: "error",
        "semi-spacing": ["error",
            {
                before: false,
                after: true
            }
        ],
        "semi-style": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": ["error",
            {
                anonymous: "never",
                named: "never",
                asyncArrow: "always"
            }
        ],
        "space-in-parens": "error",
        "space-infix-ops": "error",
        "space-unary-ops": ["error",
            {
                words: true,
                nonwords: false
            }
        ],
        "spaced-comment": ["error",
            "always",
            {
                exceptions: ["-"]
            }
        ],
        strict: ["error", "global"],
        "switch-colon-spacing": "error",
        "symbol-description": "error",
        "template-curly-spacing": ["error", "never"],
        "template-tag-spacing": "error",
        "unicode-bom": "error",
        "wrap-iife": "error",
        "yield-star-spacing": "error",
        yoda: ["error", "never", { exceptRange: true }]
    }
}];

// extends eslint-plugin-jsdoc's recommended config
const jsdocConfigs = [jsdoc.configs.recommended, {
    settings: {
        jsdoc: {
            tagNamePreference: {
                file: "fileoverview",
                augments: "extends",
                class: "constructor"
            },
            preferredTypes: {
                "*": {
                    message: "Use a more precise type or if necessary use `any` or `ArbitraryCallbackResult`",
                    replacement: "any"
                },
                Any: {
                    message: "Use a more precise type or if necessary use `any` or `ArbitraryCallbackResult`",
                    replacement: "any"
                },
                function: {
                    message: "Point to a `@callback` namepath or `Function` if truly arbitrary in form",
                    replacement: "Function"
                },
                Promise: {
                    message: "Specify the specific Promise type, including, if necessary, the type `any`"
                },
                ".<>": {
                    message: "Prefer type form without dot",
                    replacement: "<>"
                },
                object: {
                    message: "Use the specific object type or `Object` if truly arbitrary",
                    replacement: "Object"
                },
                array: "Array"
            }
        }
    },
    rules: {
        "jsdoc/check-syntax": "error",
        "jsdoc/check-values": ["error", { allowedLicenses: true }],
        "jsdoc/no-bad-blocks": "error",
        "jsdoc/no-defaults": "off",
        "jsdoc/require-asterisk-prefix": "error",
        "jsdoc/require-description": ["error", { checkConstructors: false }],
        "jsdoc/require-hyphen-before-param-description": ["error", "never"],
        "jsdoc/require-returns": ["error",
            {
                forceRequireReturn: true,
                forceReturnsWithAsync: true
            }
        ],
        "jsdoc/require-throws": "error",
        "jsdoc/tag-lines": ["error", "never",
            {
                tags: {
                    example: { lines: "always" },
                    fileoverview: { lines: "any" }
                },
                startLines: 0
            }
        ],
        "jsdoc/no-undefined-types": "off",
        "jsdoc/require-yields": "off",
        "jsdoc/check-access": "error",
        "jsdoc/check-alignment": "error",
        "jsdoc/check-param-names": "error",
        "jsdoc/check-property-names": "error",
        "jsdoc/check-tag-names": "error",
        "jsdoc/check-types": "error",
        "jsdoc/empty-tags": "error",
        "jsdoc/implements-on-classes": "error",
        "jsdoc/multiline-blocks": "error",
        "jsdoc/no-multi-asterisks": "error",
        "jsdoc/require-jsdoc": ["error", { require: { ClassDeclaration: true } }],
        "jsdoc/require-param": "error",
        "jsdoc/require-param-description": "error",
        "jsdoc/require-param-name": "error",
        "jsdoc/require-param-type": "error",
        "jsdoc/require-property": "error",
        "jsdoc/require-property-description": "error",
        "jsdoc/require-property-name": "error",
        "jsdoc/require-property-type": "error",
        "jsdoc/require-returns-check": "error",
        "jsdoc/require-returns-description": "error",
        "jsdoc/require-returns-type": "error",
        "jsdoc/require-yields-check": "error",
        "jsdoc/valid-types": "error"
    }
}];

// extends eslint-plugin-unicorn's config
const unicornConfigs = [{
    plugins: { unicorn },
    rules: {
        "unicorn/prefer-array-find": "error",
        "unicorn/prefer-array-flat-map": "error",
        "unicorn/prefer-array-flat": "error",
        "unicorn/prefer-array-index-of": "error",
        "unicorn/prefer-array-some": "error",
        "unicorn/prefer-includes": "error",
        "unicorn/prefer-set-has": "error",
        "unicorn/prefer-string-slice": "error",
        "unicorn/prefer-string-starts-ends-with": "error",
        "unicorn/prefer-string-trim-start-end": "error"
    }
}];

// extends eslint-plugin-eslint-comments's recommended config
const eslintCommentsConfigs = [eslintComments.configs.recommended, {
    rules: {
        "eslint-comments/disable-enable-pair": ["error"],
        "eslint-comments/no-unused-disable": "error",
        "eslint-comments/require-description": "error"
    }
}];

module.exports = [
    { linterOptions: { reportUnusedDisableDirectives: true } },
    ...jsConfigs,
    ...nodeConfigs,
    ...unicornConfigs,
    ...jsdocConfigs,
    ...eslintCommentsConfigs
];
