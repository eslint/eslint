/**
 * @fileoverview ESLint configuration file
 * @author Nicholas C. Zakas
 */

"use strict";

/*
 * IMPORTANT!
 *
 * Any changes made to this file must also be made to .eslintrc.js.
 *
 * Internally, ESLint is using the eslint.config.js file to lint itself.
 * The .eslintrc.js file is needed too, because:
 *
 * 1. There are tests that expect .eslintrc.js to be present to actually run.
 * 2. ESLint VS Code extension expects eslintrc config files to be
 *    present to work correctly.
 *
 * Once we no longer need to support both eslintrc and flat config, we will
 * remove .eslintrc.js.
 */

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const path = require("path");
const internalPlugin = require("eslint-plugin-internal-rules");
const eslintPluginRulesRecommendedConfig = require("eslint-plugin-eslint-plugin/configs/rules-recommended");
const eslintPluginTestsRecommendedConfig = require("eslint-plugin-eslint-plugin/configs/tests-recommended");
const globals = require("globals");
const merge = require("lodash.merge");
const baseConfig = require("eslint-config-eslint");

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

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

module.exports = [
    ...baseConfig,
    {
        ignores: [
            "build/**",
            "coverage/**",
            "docs/*",
            "!docs/*.js",
            "!docs/tools/",
            "jsdoc/**",
            "templates/**",
            "tests/bench/**",
            "tests/fixtures/**",
            "tests/performance/**",
            "tmp/**",
            "tools/internal-rules/node_modules/**",
            "**/test.js"
        ]
    },
    {
        plugins: {
            "internal-rules": internalPlugin
        },
        languageOptions: {
            ecmaVersion: "latest"
        },

        /*
         * it fixes eslint-plugin-jsdoc's reports: "Invalid JSDoc tag name "template" jsdoc/check-tag-names"
         * refs: https://github.com/gajus/eslint-plugin-jsdoc#check-tag-names
         */
        settings: {
            jsdoc: {
                mode: "typescript"
            }
        },
        rules: {
            "internal-rules/multiline-comment-style": "error"
        }
    },
    {
        files: ["tools/*.js", "docs/tools/*.js"],
        rules: {
            "no-console": "off",
            "n/no-process-exit": "off"
        }
    },
    {
        files: ["lib/rules/*", "tools/internal-rules/*"],
        ignores: ["**/index.js"],
        ...merge({}, eslintPluginRulesRecommendedConfig, {
            rules: {
                "eslint-plugin/prefer-placeholders": "error",
                "eslint-plugin/prefer-replace-text": "error",
                "eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
                "eslint-plugin/require-meta-docs-description": ["error", { pattern: "^(Enforce|Require|Disallow) .+[^. ]$" }],
                "internal-rules/no-invalid-meta": "error"
            }
        })
    },
    {
        files: ["lib/rules/*"],
        ignores: ["**/index.js"],
        rules: {
            "eslint-plugin/require-meta-docs-url": ["error", { pattern: "https://eslint.org/docs/latest/rules/{{name}}" }]
        }
    },
    {
        files: ["tests/lib/rules/*", "tests/tools/internal-rules/*"],
        ...merge({}, eslintPluginTestsRecommendedConfig, {
            rules: {
                "eslint-plugin/test-case-property-ordering": "error",
                "eslint-plugin/test-case-shorthand-strings": "error"
            }
        })
    },
    {
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

    // Restrict relative path imports
    {
        files: ["lib/*"],
        ignores: ["lib/unsupported-api.js"],
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
];
