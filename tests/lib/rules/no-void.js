/**
 * @fileoverview Rule to disallow use of void operator.
 * @author Mike Sidorov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-void");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-void", rule, {
    valid: [
        "var foo = bar()",
        "foo.void()",
        "foo.void = bar",
        "delete foo;",
        {
            code: "void 0",
            options: [{ allowAsStatement: true }]
        },
        {
            code: "void(0)",
            options: [{ allowAsStatement: true }]
        }
    ],

    invalid: [
        {
            code: "void 0",
            errors: [{ messageId: "noVoid" }]
        },
        {
            code: "void 0",
            options: [{}],
            errors: [{ messageId: "noVoid" }]
        },
        {
            code: "void 0",
            options: [{ allowAsStatement: false }],
            errors: [{ messageId: "noVoid" }]
        },
        {
            code: "void(0)",
            errors: [{ messageId: "noVoid" }]
        },
        {
            code: "var foo = void 0",
            errors: [{ messageId: "noVoid" }]
        },
        {
            code: "var foo = void 0",
            options: [{ allowAsStatement: true }],
            errors: [{ messageId: "noVoid" }]
        }
    ]
});
