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
        "var foo = bar === baz ? qux : quxx;",
        { code: "foo ? bar : baz === qux ? quxx : foobar;", options: [{ allowAlternate: true }] },
        { code: "foo ? bar : baz === qux ? quxx : quxxx === quux ? fooz : foobar;", options: [{ allowAlternate: true }] }
    ],
    invalid: [
        { code: "foo ? bar : baz === qux ? quxx : foobar;", errors: [{ message: "Do not nest ternary expressions.", type: "ConditionalExpression" }] },
        { code: "foo ? baz === qux ? quxx : foobar : bar;", errors: [{ message: "Do not nest ternary expressions.", type: "ConditionalExpression" }] },
        { code: "foo ? bar : baz === qux ? quxx : foobar;", options: [{ allowAlternate: false }], errors: [{ message: "Do not nest ternary expressions.", type: "ConditionalExpression" }] },
        { code: "foo ? baz === qux ? quxx : foobar : bar;", options: [{ allowAlternate: true }], errors: [{ message: "Do not nest ternary expressions.", type: "ConditionalExpression" }] }
    ]
});
