/**
 * @fileoverview Tests for the no-dupe-else-if rule
 * @author Milos Djermanovic
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-dupe-else-if");
const { RuleTester } = require("../../../lib/rule-tester");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("no-dupe-else-if", rule, {
    valid: [

        // different test conditions
        "if (a) {} else if (b) {}",
        "if (a); else if (b); else if (c);",
        "if (true) {} else if (false) {} else {}",
        "if (1) {} else if (2) {}",
        "if (f) {} else if (f()) {}",
        "if (f(a)) {} else if (g(a)) {}",
        "if (f(a)) {} else if (f(b)) {}",
        "if (a === 1) {} else if (a === 2) {}",
        "if (a === 1) {} else if (b === 1) {}",

        // not an if-else-if chain
        "if (a) {}",
        "if (a);",
        "if (a) {} else {}",
        "if (a) if (a) {}",
        "if (a) if (a);",
        "if (a) { if (a) {} }",
        "if (a) {} else { if (a) {} }",
        "if (a) {} if (a) {}",
        "if (a); if (a);",
        "while (a) if (a);",
        "if (a); else a ? a : a;",

        // not same conditions in the chain
        "if (a) { if (b) {} } else if (b) {}",
        "if (a) if (b); else if (a);",

        // not equal tokens
        "if (a) {} else if (!!a) {}",
        "if (a === 1) {} else if (a === (1)) {}",

        // more complex valid chains (may contain redundant subconditions, but the branch can be executed)
        "if (a || b) {} else if (c || d) {}",
        "if (a || b) {} else if (a || c) {}",
        "if (a) {} else if (a || b) {}",
        "if (a) {} else if (b) {} else if (a || b || c) {}",
        "if (a && b) {} else if (a) {} else if (b) {}",
        "if (a && b) {} else if (b && c) {} else if (a && c) {}",
        "if (a && b) {} else if (b || c) {}",
        "if (a) {} else if (b && (a || c)) {}",
        "if (a) {} else if (b && (c || d && a)) {}",
        "if (a && b && c) {} else if (a && b && (c || d)) {}"
    ],

    invalid: [

        // basic tests
        {
            code: "if (a) {} else if (a) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 20 }]
        },
        {
            code: "if (a); else if (a);",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 18 }]
        },
        {
            code: "if (a) {} else if (a) {} else {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 20 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (a) {} else if (c) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 35 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (a) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 35 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (c) {} else if (a) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 50 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (b) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 35 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (b) {} else {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 35 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (c) {} else if (b) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 50 }]
        },
        {
            code: "if (a); else if (b); else if (c); else if (b); else if (d); else;",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 44 }]
        },
        {
            code: "if (a); else if (b); else if (c); else if (d); else if (b); else if (e);",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 57 }]
        },

        // multiple duplicates of the same condition
        {
            code: "if (a) {} else if (a) {} else if (a) {}",
            errors: [
                { messageId: "unexpected", type: "Identifier", column: 20 },
                { messageId: "unexpected", type: "Identifier", column: 35 }
            ]
        },

        // multiple duplicates of different conditions
        {
            code: "if (a) {} else if (b) {} else if (a) {} else if (b) {} else if (a) {}",
            errors: [
                { messageId: "unexpected", type: "Identifier", column: 35 },
                { messageId: "unexpected", type: "Identifier", column: 50 },
                { messageId: "unexpected", type: "Identifier", column: 65 }
            ]
        },

        // inner if statements do not affect chain
        {
            code: "if (a) { if (b) {} } else if (a) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 31 }]
        },

        // various kinds of test conditions
        {
            code: "if (a === 1) {} else if (a === 1) {}",
            errors: [{ messageId: "unexpected", type: "BinaryExpression", column: 26 }]
        },
        {
            code: "if (1 < a) {} else if (1 < a) {}",
            errors: [{ messageId: "unexpected", type: "BinaryExpression", column: 24 }]
        },
        {
            code: "if (true) {} else if (true) {}",
            errors: [{ messageId: "unexpected", type: "Literal", column: 23 }]
        },
        {
            code: "if (a && b) {} else if (a && b) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 25 }]
        },
        {
            code: "if (a && b || c)  {} else if (a && b || c) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 31 }]
        },
        {
            code: "if (f(a)) {} else if (f(a)) {}",
            errors: [{ messageId: "unexpected", type: "CallExpression", column: 23 }]
        },

        // spaces and comments do not affect comparison
        {
            code: "if (a === 1) {} else if (a===1) {}",
            errors: [{ messageId: "unexpected", type: "BinaryExpression", column: 26 }]
        },
        {
            code: "if (a === 1) {} else if (a === /* comment */ 1) {}",
            errors: [{ messageId: "unexpected", type: "BinaryExpression", column: 26 }]
        },

        // extra parens around the whole test condition do not affect comparison
        {
            code: "if (a === 1) {} else if ((a === 1)) {}",
            errors: [{ messageId: "unexpected", type: "BinaryExpression", column: 27 }]
        },

        // more complex errors with `||` and `&&`
        {
            code: "if (a || b) {} else if (a) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 25 }]
        },
        {
            code: "if (a || b) {} else if (a) {} else if (b) {}",
            errors: [
                { messageId: "unexpected", type: "Identifier", column: 25 },
                { messageId: "unexpected", type: "Identifier", column: 40 }
            ]
        },
        {
            code: "if (a || b) {} else if (b || a) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 25 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (a || b) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 35 }]
        },
        {
            code: "if (a || b) {} else if (c || d) {} else if (a || d) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 45 }]
        },
        {
            code: "if ((a === b && fn(c)) || d) {} else if (fn(c) && a === b) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 42 }]
        },
        {
            code: "if (a) {} else if (a && b) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 20 }]
        },
        {
            code: "if (a && b) {} else if (b && a) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 25 }]
        },
        {
            code: "if (a && b) {} else if (a && b && c) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 25 }]
        },
        {
            code: "if (a || c) {} else if (a && b || c) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 25 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (c && a || b) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 35 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (c && (a || b)) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 35 }]
        },
        {
            code: "if (a) {} else if (b && c) {} else if (d && (a || e && c && b)) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 40 }]
        },
        {
            code: "if (a || b && c) {} else if (b && c && d) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 30 }]
        },
        {
            code: "if (a || b) {} else if (b && c) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 25 }]
        },
        {
            code: "if (a) {} else if (b) {} else if ((a || b) && c) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 35 }]
        },
        {
            code: "if ((a && (b || c)) || d) {} else if ((c || b) && e && a) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 39 }]
        },
        {
            code: "if (a && b || b && c) {} else if (a && b && c) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 35 }]
        },
        {
            code: "if (a) {} else if (b && c) {} else if (d && (c && e && b || a)) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 40 }]
        },
        {
            code: "if (a || (b && (c || d))) {} else if ((d || c) && b) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 39 }]
        },
        {
            code: "if (a || b) {} else if ((b || a) && c) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 25 }]
        },
        {
            code: "if (a || b) {} else if (c) {} else if (d) {} else if (b && (a || c)) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 55 }]
        },
        {
            code: "if (a || b || c) {} else if (a || (b && d) || (c && e)) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 30 }]
        },
        {
            code: "if (a || (b || c)) {} else if (a || (b && c)) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 32 }]
        },
        {
            code: "if (a || b) {} else if (c) {} else if (d) {} else if ((a || c) && (b || d)) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 55 }]
        },
        {
            code: "if (a) {} else if (b) {} else if (c && (a || d && b)) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 35 }]
        },
        {
            code: "if (a) {} else if (a || a) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 20 }]
        },
        {
            code: "if (a || a) {} else if (a || a) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 25 }]
        },
        {
            code: "if (a || a) {} else if (a) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 25 }]
        },
        {
            code: "if (a) {} else if (a && a) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 20 }]
        },
        {
            code: "if (a && a) {} else if (a && a) {}",
            errors: [{ messageId: "unexpected", type: "LogicalExpression", column: 25 }]
        },
        {
            code: "if (a && a) {} else if (a) {}",
            errors: [{ messageId: "unexpected", type: "Identifier", column: 25 }]
        }
    ]
});
