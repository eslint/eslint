/**
 * @fileoverview Tests for no-undefined rule.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslint = require("../../../lib/eslint"),
    ESLintTester = require("eslint-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var errors = [{ message: "Unexpected use of undefined.", type: "Identifier"}];

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest("lib/rules/no-undefined", {
    valid: [
        "void 0",
        "void!0",
        "void-0",
        "void+0",
        "null",
        "undefine",
        "ndefined",
        "a.undefined",
        "this.undefined",
        "global['undefined']"
    ],
    invalid: [
        { code: "undefined", errors: errors },
        { code: "undefined.a", errors: errors },
        { code: "a[undefined]", errors: errors },
        { code: "undefined[0]", errors: errors },
        { code: "f(undefined)", errors: errors },
        { code: "function f(undefined) {}", errors: errors },
        { code: "var undefined;", errors: errors },
        { code: "try {} catch(undefined) {}", errors: errors },
        { code: "(function undefined(){}())", errors: errors }
    ]
});
