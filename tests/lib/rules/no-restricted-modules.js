/**
 * @fileoverview Tests for no-restricted-modules.
 * @author Christian Schulz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("../../../lib/testers/eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-restricted-modules", {
    valid: [
        { code: "require(\"fs\")", args: [2, "crypto"]},
        { code: "require(\"path\")", args: [2, "crypto", "stream", "os"]},
        { code: "require(\"fs \")", args: 0 },
        { code: "require(2)", args: [2, "crypto"]},
        { code: "require(foo)", args: [2, "crypto"]},
        { code: "var foo = bar('crypto');", args: [2, "crypto"]}
    ],
    invalid: [{
        code: "require(\"fs\")", args: [2, "fs"],
        errors: [{ message: "'fs' module is restricted from being used.", type: "CallExpression"}]
    }, {
        code: "require(\"os \")", args: [2, "fs", "crypto ", "stream", "os"],
        errors: [{ message: "'os' module is restricted from being used.", type: "CallExpression"}]
    }]
});
