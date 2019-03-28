"use strict";

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
    },
    overrides: [
        {
            files: ["lib/rules/*", "tools/internal-rules/*"],
            excludedFiles: ["tools/internal-rules/index.js"],
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
            env: { mocha: true },
            rules: {
                "no-restricted-syntax": ["error", {
                    selector: "CallExpression[callee.object.name='assert'][callee.property.name='doesNotThrow']",
                    message: "`assert.doesNotThrow()` should be replaced with a comment next to the code."
                }]
            }
        }
    ]
};
