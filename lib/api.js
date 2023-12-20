/**
 * @fileoverview Expose out ESLint and CLI to require.
 * @author Ian Christian Myers
 */

"use strict";

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

const { FlatESLint } = require("./eslint/flat-eslint");
const { Linter } = require("./linter");
const { FlatRuleTester } = require("./rule-tester");
const { SourceCode } = require("./source-code");

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------

module.exports = {
    Linter,
    ESLint: FlatESLint,
    RuleTester: FlatRuleTester,
    SourceCode
};
