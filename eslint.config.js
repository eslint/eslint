"use strict";

const { importESLintRC, importEnvGlobals, importPlugin } = require("./lib/simpleconfig/eslintconfig");


module.exports = [
    // convert plugins to simple configs
    importPlugin("eslint-plugin"),
    importPlugin("internal-rules"),

    // convert shareable configs into simple configs
    importESLintRC("eslint", __dirname),
    importESLintRC("plugin:eslint-plugin/recommended", __dirname),

    // overrides manually converted to simple configs
    {
        files: ["**/*.js"],
        rules: {
            "eslint-plugin/consistent-output": "error",
            "eslint-plugin/no-deprecated-context-methods": "error",
            "eslint-plugin/prefer-output-null": "error",
            "eslint-plugin/prefer-placeholders": "error",
            "eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
            "eslint-plugin/require-meta-type": "error",
            "eslint-plugin/test-case-property-ordering": "error",
            "eslint-plugin/test-case-shorthand-strings": "error",
            "internal-rules/multiline-comment-style": "error"
        }
    },

    {
        files: ["lib/rules/*", "tools/internal-rules/*"],
        ignores: ["tools/internal-rules/index.js"],
        rules: {
            "internal-rules/no-invalid-meta": "error",
            "internal-rules/consistent-docs-description": "error"

            /*
                * TODO: enable it when all the rules using meta.messages
                * "internal-rules/consistent-meta-messages": "error"
                */
        }
    }, {
        files: ["tools/internal-rules/*"],
        rules: {
            "node/no-unpublished-require": "off"
        }
    }, {
        files: ["lib/rules/*"],
        rules: {
            "internal-rules/consistent-docs-url": "error"
        }
    }, {
        files: ["tests/**/*"],
        globals: {
            ...importEnvGlobals("mocha")
        },
        rules: {
            "no-restricted-syntax": ["error", {
                selector: "CallExpression[callee.object.name='assert'][callee.property.name='doesNotThrow']",
                message: "`assert.doesNotThrow()` should be replaced with a comment next to the code."
            }]
        }
    }
];