/**
 * @fileoverview Expose out ESLint and CLI to require.
 * @author Ian Christian Myers
 */

module.exports = {
    linter: require("./eslint"),
    cli: require("./cli")
};