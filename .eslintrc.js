"use strict";

const internalFiles = [
    "**/cli-engine/**/*",
    "**/init/**/*",
    "**/linter/**/*",
    "**/rule-tester/**/*",
    "**/rules/**/*",
    "**/source-code/**/*"
];

module.exports = {
    root: true,
    plugins: [
        "eslint-plugin",
        "internal-rules"
    ],
    extends: [
        "eslint",
        "plugin:eslint-plugin/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        "eslint-plugin/consistent-output": "error",
        "eslint-plugin/no-deprecated-context-methods": "error",
        "eslint-plugin/prefer-output-null": "error",
        "eslint-plugin/prefer-placeholders": "error",
        "eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
        "eslint-plugin/require-meta-docs-description": "error",
        "eslint-plugin/require-meta-type": "error",
        "eslint-plugin/test-case-property-ordering": [
            "error",

            // https://github.com/not-an-aardvark/eslint-plugin-eslint-plugin/issues/79
            [
                "filename",
                "code",
                "output",
                "options",
                "parser",
                "parserOptions",
                "globals",
                "env",
                "errors"
            ]
        ],
        "eslint-plugin/test-case-shorthand-strings": "error",
        "internal-rules/multiline-comment-style": "error"
    },
    overrides: [
        {
            files: ["lib/rules/*", "tools/internal-rules/*"],
            excludedFiles: ["index.js"],
            rules: {
                "internal-rules/no-invalid-meta": "error"

                /*
                 * TODO: enable it when all the rules using meta.messages
                 * "internal-rules/consistent-meta-messages": "error"
                 */
            }
        },
        {
            files: ["lib/rules/*"],
            excludedFiles: ["index.js"],
            rules: {
                "internal-rules/consistent-docs-url": "error"
            }
        },
        {
            files: ["tests/**/*"],
            env: { mocha: true },
            rules: {
                "no-restricted-syntax": ["error", {
                    selector: "CallExpression[callee.object.name='assert'][callee.property.name='doesNotThrow']",
                    message: "`assert.doesNotThrow()` should be replaced with a comment next to the code."
                }]
            }
        },

        // Restrict relative path imports
        {
            files: ["lib/*"],
            rules: {
                "no-restricted-modules": ["error", {
                    patterns: [
                        ...internalFiles
                    ]
                }]
            }
        },
        {
            files: ["lib/cli-engine/**/*"],
            rules: {
                "no-restricted-modules": ["error", {
                    patterns: [
                        ...internalFiles,
                        "**/init"
                    ]
                }]
            }
        },
        {
            files: ["lib/init/**/*"],
            rules: {
                "no-restricted-modules": ["error", {
                    patterns: [
                        ...internalFiles,
                        "**/rule-tester"
                    ]
                }]
            }
        },
        {
            files: ["lib/linter/**/*"],
            rules: {
                "no-restricted-modules": ["error", {
                    patterns: [
                        ...internalFiles,
                        "fs",
                        "**/cli-engine",
                        "**/init",
                        "**/rule-tester"
                    ]
                }]
            }
        },
        {
            files: ["lib/rules/**/*"],
            rules: {
                "no-restricted-modules": ["error", {
                    patterns: [
                        ...internalFiles,
                        "fs",
                        "**/cli-engine",
                        "**/init",
                        "**/linter",
                        "**/rule-tester",
                        "**/source-code"
                    ]
                }]
            }
        },
        {
            files: ["lib/shared/**/*"],
            rules: {
                "no-restricted-modules": ["error", {
                    patterns: [
                        ...internalFiles,
                        "**/cli-engine",
                        "**/init",
                        "**/linter",
                        "**/rule-tester",
                        "**/source-code"
                    ]
                }]
            }
        },
        {
            files: ["lib/source-code/**/*"],
            rules: {
                "no-restricted-modules": ["error", {
                    patterns: [
                        ...internalFiles,
                        "fs",
                        "**/cli-engine",
                        "**/init",
                        "**/linter",
                        "**/rule-tester",
                        "**/rules"
                    ]
                }]
            }
        },
        {
            files: ["lib/rule-tester/**/*"],
            rules: {
                "no-restricted-modules": ["error", {
                    patterns: [
                        ...internalFiles,
                        "**/cli-engine",
                        "**/init"
                    ]
                }]
            }
        }
    ]
};
