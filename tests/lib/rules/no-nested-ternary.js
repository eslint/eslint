/**
 * @fileoverview Tests for the no-nested-ternary rule
 * @author Ian Christian Myers
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-nested-ternary"),
    RuleTester = require("../../../lib/testers/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-nested-ternary", rule, {
    valid: [
        "foo ? doBar() : doBaz();",
        "var foo = bar === baz ? qux : quxx;"
    ],
    invalid: [
        { code: "foo ? bar : baz === qux ? quxx : foobar;", errors: [{ message: "Do not nest ternary expressions.", type: "ConditionalExpression" }] },
        { code: "foo ? baz === qux ? quxx : foobar : bar;", errors: [{ message: "Do not nest ternary expressions.", type: "ConditionalExpression" }] }
    ]
});
