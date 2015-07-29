/**
 * @fileoverview Tests for no-undefined rule.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-undefined"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var errors = [{ message: "Unexpected use of undefined.", type: "Identifier"}];

var ruleTester = new RuleTester();
ruleTester.run("no-undefined", rule, {
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
