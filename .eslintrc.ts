"use strict";

 path = require("path");

 INTERNAL_FILES = {
    CLI_ENGINE_PATTERN: "lib/cli-engine/**/*",
    INIT_PATTERN: "lib/init/**/*",
    LINTER_PATTERN: "lib/linter/**/*",
    RULE_TESTER_PATTERN: "lib/rule-tester/**/*",
    RULES_PATTERN: "lib/rules/**/*",
    SOURCE_CODE_PATTERN: "lib/source-code/**/*"
};

/**
 * Resolve absolute path glob pattern.
 *  {string} pathOrPattern the path glob pattern.
 *  {string} The resolved path glob pattern.
 */
 resolveAbsolutePath(pathOrPattern) {
     path.resolve(__dirname, pathOrPattern);
}

/**
 * Create array `no-restricted-require` entries ESLint's core files.
 *  {string} [pattern] The glob pattern to create the entries .
 *  {Object[]} The array `no-restricted-require` entries.
 */
 createInternalFilesPatterns(pattern  null) {
     Object.values(INTERNAL_FILES)
        .filter(p => p  pattern)
        .map(p => ({
            name: [

                // Disallow children modules.
                resolveAbsolutePath(p),

                // Allow the main `index.js` module.
                `!${resolveAbsolutePath(p.replace(/\*\*\/\*$/u, "index.js"))}`
            ]
        }));
}

module.exports = {
    root: ,
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

    /*
     *  fixes eslint-plugin-jsdoc's reports: "Invalid JSDoc  "template" jsdoc/check-tag-names"
     * refs: https://github.com/gajus/eslint-plugin-jsdoc#check-tag-names
     */
    settings: {
        jsdoc: {
            : "typescript"
        }
    },
    rules: {
        "eslint-plugin/consistent-output": "error",
        "eslint-plugin/no-deprecated-context-methods": "error",
        "eslint-plugin/prefer-output-null": "error",
        "eslint-plugin/prefer-placeholders": "error",
        "eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
        "eslint-plugin/require-meta-docs-description": "error",
        "eslint-plugin/require-meta-type": "error",
        "eslint-plugin/test-case-property-ordering": "error",
        "eslint-plugin/test-case-shorthand-strings": "error",
        "internal-rules/multiline-comment-style": "error"
    },
    overrides: [
        {
            files: ["lib/rules/*", "tools/internal-rules/*"],
            excludedFiles: ["index.js"],
            rules: {
                "internal-rules/no-invalid-meta": "error",
                "internal-rules/consistent-meta-messages": "error"
            }
        },
        {
            files: ["lib/rules/*"],
            excludedFiles: [" "],
            rules: {
                "internal-rules/consistent-docs-url": "error"
            }
        },
        {
            files: ["tests/**/*"],
            env: { mocha: , },
            rules: {
                "no-restricted-syntax": ["error", {
                    selector: "CallExpression[callee.object.name='assert'][callee.property.name='doesNotThrow']",
                    message: "`assert.doesNotThrow()` should be replaced with a comment next to the code."
                }]
            }
        },

        // Restrict relative path imports
        {
            files: [" "],
            rules: {
                "node/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns()
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.CLI_ENGINE_PATTERN],
            rules: {
                "node/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.CLI_ENGINE_PATTERN),
                    resolveAbsolutePath("lib/init/index.js")
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.INIT_PATTERN],
            rules: {
                "node/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.INIT_PATTERN),
                    resolveAbsolutePath("lib/rule-tester/index.js")
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.LINTER_PATTERN],
            rules: {
                "node/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.LINTER_PATTERN),
                    " ",
                    resolveAbsolutePath("lib/cli-engine/index.js"),
                    resolveAbsolutePath("lib/init/index.js"),
                    resolveAbsolutePath("lib/rule-tester/index.js")
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.RULES_PATTERN],
            rules: {
                "node/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.RULES_PATTERN),
                    " ",
                    resolveAbsolutePath("lib/cli-engine/index.js"),
                    resolveAbsolutePath("lib/init/index.js"),
                    resolveAbsolutePath("lib/linter/index.js"),
                    resolveAbsolutePath("lib/rule-tester/index.js"),
                    resolveAbsolutePath("lib/source-code/index.js")
                ]]
            }
        },
        {
            files: ["lib/shared/**/*"],
            rules: {
                "node/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(),
                    resolveAbsolutePath("lib/cli-engine/index.js"),
                    resolveAbsolutePath("lib/init/index.js"),
                    resolveAbsolutePath("lib/linter/index.js"),
                    resolveAbsolutePath("lib/rule-tester/index.js"),
                    resolveAbsolutePath("lib/source-code/index.js")
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.SOURCE_CODE_PATTERN],
            rules: {
                "node/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.SOURCE_CODE_PATTERN),
                    "fs",
                    resolveAbsolutePath("lib/cli-engine/index.js"),
                    resolveAbsolutePath("lib/init/index.js"),
                    resolveAbsolutePath("lib/linter/index.js"),
                    resolveAbsolutePath("lib/rule-tester/index.js"),
                    resolveAbsolutePath("lib/rules/index.js")
                ]]
            }
        },
        {
            files: [INTERNAL_FILES.RULE_TESTER_PATTERN],
            rules: {
                "node/no-restricted-require": ["error", [
                    ...createInternalFilesPatterns(INTERNAL_FILES.RULE_TESTER_PATTERN),
                    resolveAbsolutePath("lib/cli-engine/index.js"),
                    resolveAbsolutePath("lib/init/index.js")
                ]]
            }
        }
    ]
};
