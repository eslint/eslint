/**
 * @fileoverview ESLint configuration file
 * @author Nicholas C. Zakas
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const path = require("node:path");
const internalPlugin = require("./tools/internal-rules");
const eslintPluginRulesRecommendedConfig = require("eslint-plugin-eslint-plugin/configs/rules-recommended");
const eslintPluginTestsRecommendedConfig = require("eslint-plugin-eslint-plugin/configs/tests-recommended");
const globals = require("globals");
const eslintConfigESLintCJS = require("eslint-config-eslint/cjs");
const eslintConfigESLintFormatting = require("eslint-config-eslint/formatting");
const json = require("@eslint/json");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

const INTERNAL_FILES = {
    CLI_ENGINE_PATTERN: "lib/cli-engine/**/*.js",
    LINTER_PATTERN: "lib/linter/**/*.js",
    RULE_TESTER_PATTERN: "lib/rule-tester/**/*.js",
    RULES_PATTERN: "lib/rules/**/*.js",
    SOURCE_CODE_PATTERN: "lib/source-code/**/*.js"
};

const ALL_JS_FILES = "**/*.js";

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

module.exports = [
    ...eslintConfigESLintCJS.map(config => ({
        ...config,
        name: `eslint/${config.name}`,
        files: [ALL_JS_FILES]
    })),
    {
        ...eslintConfigESLintFormatting,
        name: "eslint/formatting",
        files: [ALL_JS_FILES]
    },
    {
        name: "eslint/global-ignores",
        ignores: [
            "build/**",
            "coverage/**",
            "docs/!(src|tools)/",
            "docs/src/!(_data)",
            "jsdoc/**",
            "templates/**",
            "tests/bench/**",
            "tests/fixtures/**",
            "tests/performance/**",
            "tmp/**",
            "**/test.js"
        ]
    },
    {
        name: "eslint/internal-rules",
        files: [ALL_JS_FILES],
        plugins: {
            "internal-rules": internalPlugin
        },
        languageOptions: {
            ecmaVersion: "latest"
        },
        rules: {
            "internal-rules/multiline-comment-style": "error"
        }
    },
    {
        name: "eslint/tools",
        files: ["tools/*.js", "docs/tools/*.js"],
        rules: {
            "no-console": "off",
            "n/no-process-exit": "off"
        }
    },
    {
        name: "eslint/rules",
        files: ["lib/rules/*.js", "tools/internal-rules/*.js"],
        ignores: ["**/index.js"],
        ...eslintPluginRulesRecommendedConfig,
        rules: {
            ...eslintPluginRulesRecommendedConfig.rules,
            "eslint-plugin/prefer-placeholders": "error",
            "eslint-plugin/prefer-replace-text": "error",
            "eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
            "eslint-plugin/require-meta-docs-description": ["error", { pattern: "^(Enforce|Require|Disallow) .+[^. ]$" }],
            "internal-rules/no-invalid-meta": "error"
        }
    },
    {
        name: "eslint/core-rules",
        files: ["lib/rules/*.js"],
        ignores: ["**/index.js"],
        rules: {
            "eslint-plugin/require-meta-docs-url": ["error", { pattern: "https://eslint.org/docs/latest/rules/{{name}}" }]
        }
    },
    {
        name: "eslint/rules-tests",
        files: ["tests/lib/rules/*.js", "tests/tools/internal-rules/*.js"],
        ...eslintPluginTestsRecommendedConfig,
        rules: {
            ...eslintPluginTestsRecommendedConfig.rules,
            "eslint-plugin/test-case-property-ordering": [
                "error",
                [
                    "name",
                    "filename",
                    "code",
                    "output",
                    "options",
                    "languageOptions",
                    "errors"
                ]
            ],
            "eslint-plugin/test-case-shorthand-strings": "error"
        }
    },
    {
        name: "eslint/tests",
        files: ["tests/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.mocha
            }
        },
        rules: {
            "no-restricted-syntax": ["error", {
                selector: "CallExpression[callee.object.name='assert'][callee.property.name='doesNotThrow']",
                message: "`assert.doesNotThrow()` should be replaced with a comment next to the code."
            }]
        }
    },

    // JSON files
    {
        name: "eslint/json",
        files: ["**/*.json", ".c8rc"],
        ignores: ["**/package-lock.json"],
        language: "json/json",
        ...json.configs.recommended
    },

    // JSONC files
    {
        name: "eslint/json",
        files: [".vscode/*.json"],
        language: "json/jsonc"
    },

    // Restrict relative path imports
    {
        name: "eslint/lib",
        files: ["lib/*.js"],
        ignores: ["lib/unsupported-api.js"],
        rules: {
            "n/no-restricted-require": ["error", [
                ...createInternalFilesPatterns()
            ]]
        }
    },
    {
        name: "eslint/cli-engine",
        files: [INTERNAL_FILES.CLI_ENGINE_PATTERN],
        rules: {
            "n/no-restricted-require": ["error", [
                ...createInternalFilesPatterns(INTERNAL_FILES.CLI_ENGINE_PATTERN)
            ]]
        }
    },
    {
        name: "eslint/linter",
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
        name: "eslint/rules",
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
        name: "eslint/shared",
        files: ["lib/shared/**/*.js"],
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
        name: "eslint/source-code",
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
        name: "eslint/rule-tester",
        files: [INTERNAL_FILES.RULE_TESTER_PATTERN],
        rules: {
            "n/no-restricted-require": ["error", [
                resolveAbsolutePath("lib/cli-engine/index.js")
            ]]
        }
    }
];
