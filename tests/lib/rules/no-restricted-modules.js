/**
 * @fileoverview Tests for no-restricted-modules.
 * @author Christian Schulz
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-restricted-modules"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-restricted-modules", rule, {
    valid: [
        { code: "require(\"fs\")", options: ["crypto"]},
        { code: "require(\"path\")", options: ["crypto", "stream", "os"]},
        { code: "require(\"fs \")", args: 0 },
        { code: "require(2)", options: ["crypto"]},
        { code: "require(foo)", options: ["crypto"]},
        { code: "var foo = bar('crypto');", options: ["crypto"]}
    ],
    invalid: [{
        code: "require(\"fs\")", options: ["fs"],
        errors: [{ message: "'fs' module is restricted from being used.", type: "CallExpression"}]
    }, {
        code: "require(\"os \")", options: ["fs", "crypto ", "stream", "os"],
        errors: [{ message: "'os' module is restricted from being used.", type: "CallExpression"}]
    }]
});
