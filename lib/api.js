/**
 * @fileoverview Expose out ESLint and CLI to require.
 * @author Ian Christian Myers
 * @copyright jQuery Foundation and other contributors, https://jquery.org/
 * MIT License
 */

"use strict";

module.exports = {
    linter: require("./eslint"),
    CLIEngine: require("./cli-engine"),
    RuleTester: require("./testers/rule-tester"),
    SourceCode: require("./util/source-code")
};
