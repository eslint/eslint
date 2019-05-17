"use strict";

const path = require("path");
const rulesDirPlugin = require("eslint-plugin-rulesdir");

rulesDirPlugin.RULES_DIR = path.join(__dirname, "tools/internal-rules");

module.exports = {
    root: true,
    plugins: [
        "eslint-plugin",
        "rulesdir"
    ],
    extends: [
        "./packages/eslint-config-eslint/default.yml",
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
        "rulesdir/multiline-comment-style": "error"
    },
    overrides: [
        {
            files: ["lib/rules/*", "tools/internal-rules/*"],
            rules: {
                "rulesdir/no-invalid-meta": "error",
                "rulesdir/consistent-docs-description": "error"

                /*
                 * TODO: enable it when all the rules using meta.messages
                 * "rulesdir/consistent-meta-messages": "error"
                 */
            }
        }, {
            files: ["lib/rules/*"],
            rules: {
                "rulesdir/consistent-docs-url": "error"
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
