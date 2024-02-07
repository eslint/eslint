/*
 * IMPORTANT!
 *
 * Any changes made to this file must also be made to eslint.config.js.
 *
 * Internally, ESLint is using the eslint.config.js file to lint itself.
 * This file is needed too, because:
 *
 * 1. ESLint VS Code extension expects eslintrc config files to be
 *    present to work correctly.
 *
 * Once we no longer need to support both eslintrc and flat config, we will
 * remove this file.
 */


"use strict";

const path = require("path");

const INTERNAL_FILES = {
    CLI_ENGINE_PATTERN: "lib/cli-engine/**/*",
    LINTER_PATTERN: "lib/linter/**/*",
    RULE_TESTER_PATTERN: "lib/rule-tester/**/*",
    RULES_PATTERN: "lib/rules/**/*",
    SOURCE_CODE_PATTERN: "lib/source-code/**/*"
};

/**
 * Resolve an absolute path or glob pattern.
 * @param {string} pathOrPattern the path or glob pattern.
 * @returns {string} The resolved path or glob pattern.
 */
function resolveAbsolutePath(pathOrPattern) {
    return path.resolve(__dirname, pathOrPattern);
}

/**
 * Create an array of `no-restricted-require` entries for ESLint's core files.
 * @param {string} [pattern] The glob pattern to create the entries for.
 * @returns {Object[]} The array of `no-restricted-require` entries.
 */
function createInternalFilesPatterns(pattern = null) {
    return Object.values(INTERNAL_FILES)
        .filter(p => p !== pattern)
        .map(p => ({
            name: [

                // Disallow all children modules.
                resolveAbsolutePath(p),

                // Allow the main `index.js` module.
                `!${resolveAbsolutePath(p.replace(/\*\*\/\*$/u, "index.js"))}`
            ]
        }));
}

module.exports = {
    root: true,
    plugins: [
        "eslint-plugin",
        "internal-rules"
    ],
    extends: [
        "eslint/eslintrc"
    ],
    parserOptions: {
        ecmaVersion: 2021
    },
    rules: {
        "internal-rules/multiline-comment-style": "error"
    },
    overrides: [
        {
            files: ["tools/*.js", "docs/tools/*.js"],
            rules: {
                "no-console": "off",
                "n/no-process-exit": "off"
            }
        },
        {
            files: ["lib/rules/*", "tools/internal-rules/*"],
            excludedFiles: ["index.js"],
            extends: [
                "plugin:eslint-plugin/rules-recommended"
            ],
            rules: {
                "eslint-plugin/prefer-placeholders": "error",
                "eslint-plugin/prefer-replace-text": "error",
                "eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
                "eslint-plugin/require-meta-docs-description": ["error", { pattern: "^(Enforce|Require|Disallow) .+[^. ]$" }],
                "internal-rules/no-invalid-meta": "error"
            }
        },
        {
            files: ["lib/rules/*"],
            excludedFiles: ["index.js"],
            rules: {
                "eslint-plugin/require-meta-docs-url": ["error", { pattern: "https://eslint.org/docs/latest/rules/{{name}}" }]
            }
        },
        {
            files: ["tests/lib/rules/*", "tests/tools/internal-rules/*"],
            extends: [
                "plugin:eslint-plugin/tests-recommended"
            ],
            rules: {
                "eslint-plugin/test-case-property-ordering": "error",
                "eslint-plugin/test-case-shorthand-strings": "error"
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
            excludedFiles: ["lib/unsupported-api.js"],
            rules: {
                "n/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns()
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.CLI_ENGINE_PATTERN],
            rules: {
                "n/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.CLI_ENGINE_PATTERN)
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.LINTER_PATTERN],
            rules: {
                "n/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.LINTER_PATTERN),
                    "fs",
                    resolveAbsolutePath("lib/cli-engine/index.js"),
                    resolveAbsolutePath("lib/rule-tester/index.js")
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.RULES_PATTERN],
            rules: {
                "n/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.RULES_PATTERN),
                    "fs",
                    resolveAbsolutePath("lib/cli-engine/index.js"),
                    resolveAbsolutePath("lib/linter/index.js"),
                    resolveAbsolutePath("lib/rule-tester/index.js"),
                    resolveAbsolutePath("lib/source-code/index.js")
                ]]
            }
        },
        {
            files: ["lib/shared/**/*"],
            rules: {
                "n/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(),
                    resolveAbsolutePath("lib/cli-engine/index.js"),
                    resolveAbsolutePath("lib/linter/index.js"),
                    resolveAbsolutePath("lib/rule-tester/index.js"),
                    resolveAbsolutePath("lib/source-code/index.js")
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.SOURCE_CODE_PATTERN],
            rules: {
                "n/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.SOURCE_CODE_PATTERN),
                    "fs",
                    resolveAbsolutePath("lib/cli-engine/index.js"),
                    resolveAbsolutePath("lib/linter/index.js"),
                    resolveAbsolutePath("lib/rule-tester/index.js"),
                    resolveAbsolutePath("lib/rules/index.js")
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.RULE_TESTER_PATTERN],
            rules: {
                "n/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.RULE_TESTER_PATTERN),
                    resolveAbsolutePath("lib/cli-engine/index.js")
                ]]
            }
        }
    ]
};
