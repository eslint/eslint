/**
 * @fileoverview Tests for no-new-func rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-new-func"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-new-func", rule, {
    valid: [
        "var a = new _function(\"b\", \"c\", \"return b+c\");",
        "var a = _function(\"b\", \"c\", \"return b+c\");"
    ],
    invalid: [
        { code: "var a = new Function(\"b\", \"c\", \"return b+c\");", errors: [{ message: "The Function constructor is eval.", type: "NewExpression" }] },
        { code: "var a = Function(\"b\", \"c\", \"return b+c\");", errors: [{ message: "The Function constructor is eval.", type: "CallExpression" }] }
    ]
});
