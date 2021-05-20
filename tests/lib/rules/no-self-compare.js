/**
 * @fileoverview Tests for no-self-compare rule.
 * @author Ilya Volodin
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-self-compare"),
    { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-self-compare", rule, {
    valid: [
        "if (x === y) { }",
        "if (1 === 2) { }",
        "y=x*x",
        "foo.bar.baz === foo.bar.qux"
    ],
    invalid: [
        { code: "if (x === x) { }", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "if (x !== x) { }", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "if (x > x) { }", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "if ('x' > 'x') { }", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "do {} while (x === x)", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "x === x", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "x !== x", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "x == x", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "x != x", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "x > x", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "x < x", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "x >= x", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "x <= x", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] },
        { code: "foo.bar().baz.qux >= foo.bar ().baz .qux", errors: [{ messageId: "comparingToSelf", type: "BinaryExpression" }] }
    ]
});
