"use strict";

const path = require("path");
const rulesDirPlugin = require("eslint-plugin-rulesdir");

rulesDirPlugin.RULES_DIR = path.join(__dirname, "tools/internal-rules");

module.exports = {
    root: true,
    plugins: [
        "eslint-plugin",
        "node",
        "rulesdir"
    ],
    extends: [
        "./packages/eslint-config-eslint/default.yml",
        "plugin:node/recommended",
        "plugin:eslint-plugin/recommended"
    ],
    rules: {
        "eslint-plugin/consistent-output": "error",
        "eslint-plugin/no-deprecated-context-methods": "error",
        "eslint-plugin/prefer-output-null": "error",
        "eslint-plugin/prefer-placeholders": "error",
        "eslint-plugin/report-message-format": ["error", "[^a-z].*\\.$"],
        "eslint-plugin/test-case-property-ordering": "error",
        "eslint-plugin/test-case-shorthand-strings": "error",
        "rulesdir/multiline-comment-style": "error"
    }
};
