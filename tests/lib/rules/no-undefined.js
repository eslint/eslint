/**
 * @fileoverview Tests for no-undefined rule.
 * @author Michael Ficarra
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-undefined"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const errors = [{ message: "Unexpected use of undefined.", type: "Identifier" }];

const ruleTester = new RuleTester();

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
        { code: "undefined", errors },
        { code: "undefined.a", errors },
        { code: "a[undefined]", errors },
        { code: "undefined[0]", errors },
        { code: "f(undefined)", errors },
        { code: "function f(undefined) {}", errors },
        { code: "var undefined;", errors },
        { code: "try {} catch(undefined) {}", errors },
        { code: "(function undefined(){}())", errors },
        { code: "undefined = true", errors },
        { code: "var undefined = true", errors }
    ]
});
