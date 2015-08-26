/**
 * @fileoverview Tests for no-empty-label rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-empty-label"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-empty-label", rule, {
    valid: [
        "labeled: for (var i in {}) { }",
        { code: "labeled: for (var i of {}) { }", ecmaFeatures: { forOf: true } },
        "labeled: for (var i=10; i; i--) { }",
        "labeled: while(i) {}",
        "labeled: do {} while (i)",
        "labeled: switch(i) { case 1: break; default: break; }"
    ],
    invalid: [
        { code: "labeled: var a = 10;", errors: [{ message: "Unexpected label \"labeled\"", type: "LabeledStatement"}] }
    ]
});
